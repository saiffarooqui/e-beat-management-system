# Server

## Installation

Download or clone the server repository.

### Step 1: 
```bash
npm intall
```

Make sure you are in server directory.

## Step 2:
Create a file and name it '.env'. Add the following fields:
```bash
MONGODB_URL  = [Enter MongoDB url here]

JWT_SECRET= [Enter JWT Secret here]

TWILIO_ACCOUNT_SID= [Enter Twilio Account SID]
TWILIO_AUTH_TOKEN= [Enter Twilio Auth Token]
TWILIO_PHONE_NUMBER= [Enter Twilio Phone Number]
```

## Step 3:
Run the development server:
```bash
npm run dev
```

The server will run on PORT 5000

 
