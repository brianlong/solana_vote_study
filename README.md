# solana_vote_study
A collection of scripts &amp; utilities to study Solana validator vote history.

Raw data downloads:
Slots 233375500-233376500: https://blocklogicllc.box.com/s/dm7gfichuihotu3nsk4fnx0xxxg0v6mw

## Install Notes
Try `yarn install`. If that doesn't work, see package.json and add the libraries you see there.

We use 'dotenv' to hold sensitive data. Copy `.env.sample` to `.env` and provide your RPC URL in the `.env` file.

## ENV

Check `.env.sample` for setting ENV variable. `RPC_URL` should point an HTTP ednpoint, usually it's: `http://127.0.0.1:8899`.
