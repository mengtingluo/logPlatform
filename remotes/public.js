const create = require('../lib/remote/remote.js');
const storage = require('beyond-lib/lib/storage');
const remote = create();
const basePath = '';
const setup = {
    basePath: basePath,
    method: 'post',
    mode: "no-cors",
    requestJSON: true,
    responseJSON: true,
    headers: {
        // XTOKEN: storage.getCookie('admin-token') || ''
    }
};
remote.base(setup);
remote.on('error', error => {
    if (error.status === 900) {
        // $.fn.alertModal({msg: error.title, status: 'error'});
        return;
    }
    return error.then((data) => {
        if (data.status === 401) {
            // storage.setCookie('admin-token', '', -1);
            // storage.setCookie('urlName',location.href);
            // location.href = 'login';
        } else if(data.status === 422){
            // $.fn.alertModal({msg: data.errors[0].message, status: 'error'});
        }else {
            // $.fn.alertModal({msg: data.title, status: 'error'});
        }
    });
});
var getInfo= function (data) {
    var call = remote.extend({
        url: '/getInfo',
        body: data
    });
    return call()
};

module.exports = {
    getInfo
};



