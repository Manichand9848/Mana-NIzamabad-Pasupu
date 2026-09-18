export default async function handler(req, res) {

if(req.method !== "POST"){
return res.status(405).json({message:"Method not allowed"});
}

try{

const { amount, name, email, phone } = req.body;

if(!amount || amount <= 0 || !name || !phone){
return res.status(400).json({ error: "Missing required order details" });
}

// Build the site origin dynamically so this works on any domain
// (production, preview deployments, custom domain) without hardcoding it.
const origin = `https://${req.headers.host}`;

const orderId = "order_" + Date.now() + "_" + Math.floor(Math.random()*10000);

const response = await fetch("https://api.cashfree.com/pg/orders", {
method:"POST",

headers:{
"Content-Type":"application/json",
"x-client-id": process.env.CASHFREE_APP_ID,
"x-client-secret": process.env.CASHFREE_SECRET_KEY,
"x-api-version":"2022-09-01"
},

body:JSON.stringify({

order_id: orderId,
order_amount: amount,
order_currency:"INR",

customer_details:{
customer_id:"cust_"+Date.now(),
customer_name:name,
customer_email:email,
customer_phone:phone
},

// This is what makes Cashfree send the customer back to the
// turmeric site's own success page once payment finishes.
// {order_id} is replaced by Cashfree itself in the redirect.
order_meta:{
return_url: `${origin}/success.html?order_id={order_id}`
}

})

});

const data = await response.json();

res.status(200).json(data);

}catch(error){

res.status(500).json({
error:"Payment session creation failed"
});

}

}
