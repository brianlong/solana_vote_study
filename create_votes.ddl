CREATE database solana_vote_study;
USE solana_vote_study;

# Drop table if needed
DROP TABLE IF EXISTS votes;

# Create table
CREATE TABLE votes (
  id bigint NOT NULL AUTO_INCREMENT,
  slot bigint,
  vote_root bigint,
  vote_slot bigint,
  vote_latency int(11),
  vote_state_hash varchar(255) DEFAULT NULL,
  vote_authority varchar(255) DEFAULT NULL,
  signature  varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY index_slots (slot)
);

# Load CSV data into table
LOAD DATA INFILE '/Users/brianlong/Projects/solana_vote_study/block-233759408.csv'
INTO TABLE votes
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
IGNORE 1 LINES
(slot, vote_root, vote_slot, vote_latency, vote_state_hash, vote_authority, signature);

# Other notes for Mac OS & Homebrew
# Default options are read from the following files in the given order:
# /etc/my.cnf /etc/mysql/my.cnf /opt/homebrew/etc/my.cnf ~/.my.cnf
#
# To disable secure-file-priv for localhost development, you need to add `secure-file-priv = ""` 
# to your my.cnf file under the mysqld config group. eg:
# [mysqld]
# secure-file-priv = ""