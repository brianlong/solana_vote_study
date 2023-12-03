# Show the number of votes for each vote_state_hash in slot 233759408
SELECT vote_state_hash, count(*) as count FROM votes WHERE slot = 233759408 GROUP BY vote_state_hash ORDER BY count DESC;