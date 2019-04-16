// khai bao 1 action 
// tra ve type + tham so
// tham số có hay không cũng được
export function Login(isLogin) {
    return { type: 'LOGIN', isLogin }
}