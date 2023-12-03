// This script will run a getBlock and write the output to a CSV file.
//
// Provide RPC_URL in your .env file to check your connection.
//
// Example Use:
// node get_block.mjs <slot-number>

import * as web3 from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();
// import fs from 'fs';
import * as csvWriter from 'csv-writer';
import { createHash } from 'node:crypto'
function sha256(content) {  
  return createHash('sha256').update(content).digest('hex')
}

// Read the slot number from the command line
const start_slot = process.argv[2];
const end_slot = process.argv[3];
if(!start_slot) {throw new Error('Please provide a starting slot number')};
if(!end_slot) {throw new Error('Please provide an ending slot number')};

// Set up web3 client
const connection = new web3.Connection(
  process.env.RPC_URL, 'confirmed'
);

// Write the contents of file_output to a CSV file
const createCsvWriter = csvWriter.createArrayCsvWriter;
const csvFileWriter = createCsvWriter({
  path: `block-${start_slot}-${end_slot}.csv`,
  header: [
    {id: 'slot', title: 'Slot'},
    {id: 'vote_root', title: 'Vote Root'},
    {id: 'vote_slot', title: 'Vote Slot'},
    {id: 'vote_latency', title: 'Vote Latency'},
    {id: 'lockouts_hash', title: 'Vote Latency'},
    {id: 'vote_state_hash', title: 'Vote State Hash'},
    {id: 'vote_authority', title: 'Vote Authority'},
    {id: 'signature', title: 'Signature'}
  ]
});

// Loop from start_slot to end_slot
for(let slot_num = start_slot; slot_num <= end_slot; slot_num++) {
  const slot_number = parseInt(slot_num);
  console.log(`Processing slot ${slot_number}`);

  const account_state_votes = {};
  const file_output = [];
  try {
    const block = await connection._rpcRequest(
      'getBlock',
      connection._buildArgsAtLeastConfirmed(
        [slot_number],
        'confirmed',
        'jsonParsed',
        {
          maxSupportedTransactionVersion: 1
        }
      )
    )

    console.log(block.result.transactions.length);

    block.result.transactions.forEach((tx) => {
      // create a new PublicKey object for the Vote program ID
      const vp = new web3.PublicKey('Vote111111111111111111111111111111111111111');

      // Loop to the next tx unless tx.transaction.message.accountKeys exists
      if(!tx.transaction.message.accountKeys) return;

      // Loop to the next tx unless accountKeys includes 'Vote111111111111111111111111111111111111111'
      if(!tx.transaction.message.accountKeys.find((key) => key.pubkey == "Vote111111111111111111111111111111111111111")) return;

      // console.log(`${JSON.stringify(tx)}\n`);
      // console.log(`${JSON.stringify(tx.transaction.message.instructions[0].parsed)}\n`);
      const lockout_length = tx.transaction.message.instructions[0].parsed.info.voteStateUpdate.lockouts.length;
      const vote_slot = tx.transaction.message.instructions[0].parsed.info.voteStateUpdate.lockouts[lockout_length-1].slot;
      const lockouts_hash = sha256(JSON.stringify(tx.transaction.message.instructions[0].parsed.info.voteStateUpdate.lockouts));
      const vote_state_hash = tx.transaction.message.instructions[0].parsed.info.voteStateUpdate.hash;
      if(!account_state_votes[vote_state_hash]) {
        account_state_votes[vote_state_hash] = 0;
      }
      account_state_votes[vote_state_hash] = account_state_votes[vote_state_hash] + 1;

      const output = [
        slot_number,
        tx.transaction.message.instructions[0].parsed.info.voteStateUpdate.root,
        vote_slot,
        vote_slot - slot_number,
        lockouts_hash,
        vote_state_hash,
        tx.transaction.message.instructions[0].parsed.info.voteAuthority,
        tx.transaction.signatures[0]
      ]
      file_output.push(output);
      // console.log(`${JSON.stringify(output)}`);

    });
    // console.log(account_state_votes);

    csvFileWriter.writeRecords(file_output);
  } catch (error) {
    console.log(`Error processing slot ${slot_number}: ${error}`);
  }
}
