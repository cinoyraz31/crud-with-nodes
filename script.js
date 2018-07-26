var express = require('express');
var mysql = require('mysql');
var md5 = require('md5');
var datetime = require('node-datetime');
var promise = require('bluebird');
var app = express();

// post
app.use(express.json());

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'testDB'
});

connection.connect(function(error){
	if(!!error){
		console.log('Error');
	} else {
		console.log('Connected');
	}
});

// function Global
function checkUndefined(value, _default){
	if(typeof value == 'undefined' ) {
        value = _default;
    }

    return value;
}

function getData(modelName = "users", options, callback){
	var result = false;
	const find = options.find || "first";
	const where = checkUndefined(options.where, false);
	const val = checkUndefined(options.val, false);
	const fields = checkUndefined(options.fields, "*");
	const joins = checkUndefined(options.joins, false);
	const msg_success = options.msg.success || "berhasil query dari tabel "+modelName;
	const msg_error = options.msg.error || "Gagal query data";

	var query = "SELECT "+ fields +" FROM " + modelName;

	if(joins != false){
		var i;
		for(i = 0; i < joins.length; i++){
			var targetName = checkUndefined(joins[i].modelName, false);
			var type = checkUndefined(joins[i].type, false);
			var condition = checkUndefined(joins[i].condition, false);

			if(targetName && type && condition){
				query += " "+type+" "+targetName+" ON "+condition;
			}
		}
	}

	if(where){
		query += " where "+where;
	}

	if(find == "first"){
		query += " limit 1";
	}
	console.log(query);
	connection.query(query, val, (error, rows, fields) => {
		if(!!error){
			callback({
				"status": "error",
				"msg": "Tidak terkoneksi dengan database",
			});
		} else {

			if(rows != false){
				if(rows && find == "first"){
					rows = checkUndefined(rows[0], false);
				}

				callback({
					"status": "success",
					"msg": msg_success,
					"rows": rows
				});
			} else {
				callback({
					"status": "error",
					"msg": msg_error,
				});
			}
		}
	});
}

function update(modelName, id, options){
	var set = checkUndefined(options.SET, false);
	var val = checkUndefined(options.val, false);
	var callBack = checkUndefined(options.callBack, false);

	var query = "UPDATE "+ modelName;

	if(set != false){
		set += ", modified=?";

		query += " SET "+ set;	

		val.push(formatDate());
	}

	if(id != false){
		query += " WHERE id="+ id;
	}

	connection.query(query, val, (error, rows, fields) => {
		if(!!error){

			if(callBack != false){
				callback({
					"status": "error",
					"msg": "Gagal update data",
				});
			}
		} else {
			if(callBack != false){
				callback({
					"status": "success",
					"msg": "Berhasil update data",
				});
			}
		}
	});
}

function formatDate(date = false, format = 'Y-m-d H:M:S'){

	if(date == false){
		var date = datetime.create();
	}

	return date.format(format);
}

function checkToken(request, response, callback){
	var header = request.headers;
	var token = checkUndefined(header.token, false);

	if(token != false){
		getData('users', {
			"where": "token=?",
			'val': [token],
			'msg': {
				"success": "token aktif",
				"error": "token anda sudah expired, atau ada yang sedang menggunakan akun anda.",
				'code': "400"
			}
		}, (data) => {
			var status = checkUndefined(data.status, "error");

			if(status == 'success'){
				callback(data);
			} else {
				response.send({
					"status": "error",
					"error": "token anda sudah expired, atau ada yang sedang menggunakan akun anda.",
					'code': "400" // code untuk logout agar device / frontend mudah mengerti
				});
			}
		});
	} else {
		response.send({
			"status": "error",
			"msg": "Maaf anda belum parsing token, periksa header http",
			'code': "400" // code untuk logout agar device / frontend mudah mengerti
		});
	}
}
// 

// DETAIL
app.get('/api/data_detail/:id', (req, res) => {
	checkToken(req, res, (data) => {
		var id = checkUndefined(req.params.id, false);

		getData('reports', {
			"where": "reports.id=?",
			'val': [id],
			'fields' : "reports.*, users.name as f_name, bumns.name as bumn_name, categories.name as category_name",
			'joins': [
				{
					"modelName": "users",
					"type": "LEFT JOIN",
					"condition": "reports.user_id = users.id"
				},
				{
					"modelName": "bumns",
					"type": "LEFT JOIN",
					"condition": "reports.bumn_id = bumns.id"
				},
				{
					"modelName": "categories",
					"type": "LEFT JOIN",
					"condition": "reports.category_id = categories.id"
				}
			],
			'msg': {
				"success": "Berhasil ambil data",
				"error": "Data tidak ditemukan",
			}
		}, (result) => {
			var status = checkUndefined(result.status, "error");

			switch(status){
				case "success":
					var value = checkUndefined(result.rows, false);
					res.send(value);
					break;
				case "error":
					res.send(result);
					break;
			}
		});
	});
});

// DATA LIST
app.get('/api/data_list', (req, res) => {
	var queryAsync = promise.promisify(connection.query.bind(connection));

	checkToken(req, res, (data) => {
		var numRows;
		var queryPagination;
		var numPerPage = parseInt(req.query.npp, 10) || 5;
	  	var page = parseInt(req.query.page, 10) || 0;
	  	var numPages;
	  	var skip = page * numPerPage;

	  	var limit = skip + ',' + skip + numPerPage;

	  	var query = "SELECT r.id, u.name as f_name, b.name as bumn_name, c.name as category_name, r.name, r.no_ticket, r.description, r.status, r.date, r.photo FROM reports r LEFT JOIN users u ON r.user_id = u.id LEFT JOIN bumns b ON r.bumn_id = b.id LEFT JOIN categories c ON r.category_id = c.id ORDER BY r.id DESC LIMIT ";

	  	queryAsync('SELECT count(*) as numRows FROM reports')
		.then(function(results) {
		    numRows = results[0].numRows;
		    numPages = Math.ceil(numRows / numPerPage);
		    console.log('number of pages:', numPages);
		})
		.then(() => queryAsync(query + limit))
		.then(function(results) {
		    var responsePayload = {
		      results: results
		    };
		    if (page < numPages) {
		      responsePayload.pagination = {
		        current: page,
		        perPage: numPerPage,
		        previous: page > 0 ? page - 1 : undefined,
		        next: page < numPages - 1 ? page + 1 : undefined
		      }
		    }
		    else responsePayload.pagination = {
		      err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
		    }
		    res.json(responsePayload);
		})
		.catch(function(err) {
		    console.error(err);
		    res.json({ err: err });
		 });
	});
});

// SEARCH
app.post('/api/search', (req, res) => {
	checkToken(req, res, (val) => {
		const data = req.body; // data post

		const long = checkUndefined(data.long, false);
		const lat = checkUndefined(data.lat, false);

		getData('reports', {
			"find": "all",
			"fields": "reports.name",
			"where": "reports.long like ? OR reports.lat like ?",
			"val": [long+'%', lat+'%'],
			'msg': {
				"success": "Berhasil filter data",
				"error": "Data yang anda cari tidak ditemukan"
			}
		}, (result) => {
			var status = checkUndefined(result.status, false);

			switch(status){
				case "success":
					var values = checkUndefined(result.rows, false);

					res.send(values);
					break;
				case "error":
					res.send(result);
					break;
			}
		});
	});
});

// LOGIN
app.post('/api/login', (req, res) => {
	const data = req.body; // data post

	// declare data post
	const nik = checkUndefined(data.nik, false);
	var password = checkUndefined(data.password, false);
	const bumnid = checkUndefined(data.bumnid, false);

	// md5
	password = md5(password);
	
	getData('users', {
		"where": "nik=? and password=? and bumnid=?",
		'val': [nik, password, bumnid],
		'msg': {
			"success": "Selamat, anda berhasil login dengan nik" + nik,
			"error": "Gagal melakukan login, username atau password Anda tidak valid"
		}
	}, (result) => { // call back return from getData
		// logic after check data
		var status = checkUndefined(result.status, "error");

		switch(status){
			case "success":
				var rows = checkUndefined(result.rows, false);
				var id = checkUndefined(rows.id, false);

				var date_now = formatDate();
				var token = md5(date_now);

				// update last login & token
				update("users", id, {
					"SET": "last_login=?, token=?",
					"val":[date_now, token]
				});

				if(token){
					// setelah login harus di bawa pada header dengan variable token:xxxxx untuk 
					// menandakan dia sudah login dan untuk security juga
					result.rows.token = token;
				}

				res.send(result);
				// device frontend harus lempar ke /api/data_list untuk get data list
				break;

			case "error":
				res.send(result);
				break;
		}
	});
});

app.listen(8585, () => console.log('Process rendering....'));