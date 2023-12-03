# Show the number of votes for each vote_state_hash in slot 233759408
SELECT lockouts_hash, count(*) as count FROM votes WHERE slot = 233759408 GROUP BY lockouts_hash ORDER BY count DESC;

SELECT slot, vote_root, vote_slot, vote_latency, LEFT(lockouts_hash, 8), vote_authority, signature FROM votes WHERE vote_authority IN ('DDnAqxJVFo2GVTujibHt5cjevHMSE9bo8HJaydHoshdp', 'Fire6ZGPLaqBBGWXC8PgweVjREVXRhwzgRNkdGs1wfQM') order by slot desc limit 20;

SELECT vote_authority, count(*) as count FROM votes GROUP BY vote_authority ORDER BY count DESC;