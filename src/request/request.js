import axios from "axios";

const config = {
  baseUrl: {
    dev: "/back", // 开发环境
    // fat: 'http://xxx.xx.xx.xx:8080' 
    //uat : "http://production.com" 
  },
}

const request = axios.create({
  baseURL: config.baseUrl.dev,
  timeout: 60000,
});

//get请求
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    request
      .get(url, {
        params: params,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
//post请求
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    request.post(url, data).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}