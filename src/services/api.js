//import axios
import axios from 'axios';

const Api = axios.create({
    //set default endpoint API
    baseURL: 'http://localhost:3006'
})

export default Api