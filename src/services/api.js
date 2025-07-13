//import axios
import axios from 'axios';

const Api = axios.create({
    //set default endpoint API
    baseURL: 'https://backend_best.smktibazma.com/'
})

export default Api