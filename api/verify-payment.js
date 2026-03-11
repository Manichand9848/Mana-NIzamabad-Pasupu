export default async function handler(req, res) {

const { order_id } = req.query;

const response = await fetch(
`https://api.cashfree.com/pg/orders/${order_id}`,
{
method: "GET",
headers: {
"x-client-id": process.env.CASHFREE_APP_ID,
"x-client-secret": process.env.CASHFREE_SECRET_KEY,
"x-api-version": "2022-09-01"
}
}
);

const data = await response.json();

res.status(200).json(data);

}
