import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const url ='http://localhost:3001/';
async function readDs(start:number,length:number) {
    try {
      const res:any = await axios.post(url+'plc',{req:'readD',start:start,length:length});
      return res.data;
    } catch (error) {
        console.log('Error');
    }
}
async function writeDs(start:number,arr:number[]) {
    try {
      const res:any = await axios.post(url+'plc',{req:'writeD',start:start,arr:arr});
        // toast(res.data)
        if(res.data){
            console.log(res.data);
            toast(res.data)
        }
            
        
    } catch (error:any) {
        console.log('error',error.message);
        toast.error(`${error.message} , try again`)
    }
}
export default {
    readDs,
    writeDs,
};