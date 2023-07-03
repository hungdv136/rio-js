import axios from 'axios'

// The root URL of payment API. Default is Rio URL
// In the real system, this value is configured in your configuration management
// You should to change the to Rio root URL with format http://rio-domain/echo
const paymentURL = process.env.PAYMENT_URL || 'http://localhost:8896/echo';

export type PayRequest = {
    cardNumber: string;
    amount: number;
};

export type PayResponse = {
    id: string;
    createdAt: string;
};
  
export async function pay(params: PayRequest) {
    try {
        const url = paymentURL + '/pay'
        const { data } = await axios.post<PayResponse>(url, params);
        return { request: params, response: data} 
    } catch(error){
        console.log('Error!!! ' + error)
        return { request: params} 
    }
}