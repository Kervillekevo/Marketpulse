import requests
import base64
from datetime import datetime
from django.conf import settings



def get_access_token():

    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    response = requests.get(
        url,
        auth=(settings.MPESA_CONSUMER_KEY, settings.MPESA_CONSUMER_SECRET)
    )

    data = response.json()

    return data["access_token"]



def generate_password():


    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    data_to_encode = (
        settings.MPESA_SHORTCODE +
        settings.MPESA_PASSKEY +
        timestamp
    )

    password = base64.b64encode(data_to_encode.encode()).decode()

    return password, timestamp



def stk_push(phone, amount):


    access_token = get_access_token()

    password, timestamp = generate_password()

    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": "Marketplace",
        "TransactionDesc": "Order Payment"
    }

    response = requests.post(url, json=payload, headers=headers)

    return response.json()