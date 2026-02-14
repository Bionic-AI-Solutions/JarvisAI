-- Redis Lua script for atomic rate limit check
-- Keys: [customer_key, ip_key]
-- Args: [customer_limit, ip_limit, window_seconds]

local customer_key = KEYS[1]
local ip_key = KEYS[2]
local customer_limit = tonumber(ARGV[1])
local ip_limit = tonumber(ARGV[2])
local window_seconds = tonumber(ARGV[3])

local customer_count = tonumber(redis.call('GET', customer_key) or 0)
local ip_count = tonumber(redis.call('GET', ip_key) or 0)

if customer_count >= customer_limit or ip_count >= ip_limit then
  return 1  -- Limited
end

redis.call('INCR', customer_key)
redis.call('EXPIRE', customer_key, window_seconds)
redis.call('INCR', ip_key)
redis.call('EXPIRE', ip_key, window_seconds)

return 0  -- Allowed
