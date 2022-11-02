import axios from 'axios';
const url ='http://localhost:3000/';
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
      return res.data;
    } catch (error) {
        console.log('Error');
    }
}
export default {
    readDs,
    writeDs,
};