// khai bao 1 action 
// tra ve type + tham so
// tham số có hay không cũng được
export function Login(isLogin) {
    return { type: 'LOGIN', isLogin }
}

// _bootstrapAsync = async () => {
//     const userToken = await AsyncStorage.getItem('userToken');
//     axios.defaults.headers.common['Authorization'] = 'Bearer ' + userToken;
//     const teamId = await AsyncStorage.getItem('teamId');
//     if(userToken) {
//         if(teamId) {
//             axios.defaults.params = {
//                 teamId : teamId
//             }
//         }
//         axios.interceptors.response.use( (response) => {
//             return response;
//         },  (error) => {
//             if (401 === error.response.status) {
//                 this.props.navigation.navigate('Auth');
//             }
//         });
//         this.props.navigation.navigate(teamId ? 'App' : 'Group');
//     }else {
//         this.props.navigation.navigate('Auth');
//     }
//     // This will switch to the App screen or Auth screen and this loading
//     // screen will be unmounted and thrown away.
// };