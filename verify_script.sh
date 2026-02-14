#!/bin/bash

BASE_URL="http://localhost:3000/api"
TIMESTAMP=$(date +%s)

echo "=== Starting Verification ==="

#  Create User A
echo "Creating User A..."
EMAIL_A="usera_${TIMESTAMP}@example.com"
USER_A=$(curl -s -X POST "$BASE_URL/users" -H "Content-Type: application/json" -d "{\"firstName\":\"User\",\"lastName\":\"Alpha\",\"email\":\"$EMAIL_A\"}")
echo "Response: $USER_A"
ID_A=$(echo $USER_A | jq '.id')
echo "User A Created: $ID_A"

#  Create User B
echo "Creating User B..."
EMAIL_B="userb_${TIMESTAMP}@example.com"
USER_B=$(curl -s -X POST "$BASE_URL/users" -H "Content-Type: application/json" -d "{\"firstName\":\"User\",\"lastName\":\"Beta\",\"email\":\"$EMAIL_B\"}")
echo "Response: $USER_B"
ID_B=$(echo $USER_B | jq '.id')
echo "User B Created: $ID_B"

if [ "$ID_A" == "null" ] || [ "$ID_B" == "null" ]; then
    echo "Failed to create users. Exiting."
    exit 1
fi

#  User A creates a post
echo "User A creating a post..."
POST_A=$(curl -s -X POST "$BASE_URL/posts" -H "Content-Type: application/json" -d "{\"userId\":$ID_A,\"content\":\"Hello World #firstpost\"}")
echo "Response: $POST_A"
POST_ID=$(echo $POST_A | jq '.id')
echo "Post Created: $POST_ID"

if [ "$POST_ID" == "null" ]; then
    echo "Failed to create post. Exiting."
    exit 1
fi

# User B likes the post
echo "User B likes the post..."
curl -s -X POST "$BASE_URL/likes" -H "Content-Type: application/json" -d "{\"userId\":$ID_B,\"postId\":$POST_ID}" | jq .
echo ""

#  User B follows User A
echo "User B follows User A..."
curl -s -X POST "$BASE_URL/follow" -H "Content-Type: application/json" -d "{\"followerId\":$ID_B,\"followingId\":$ID_A}" | jq .
echo ""

#  Verify User A's followers (endpoint is /api/users/:id/followers? No, check routes)
# Index.ts: app.use('/api', followRouter);
# FollowRoutes: router.get('/users/:id/followers', ...)
echo "Verifying User B is following User A..."
FOLLOWERS=$(curl -s -X GET "$BASE_URL/users/$ID_A/followers")
echo "Followers: $FOLLOWERS"

# Verify Post details (should have likes)
echo "Verifying Post details..."
POST_DETAILS=$(curl -s -X GET "$BASE_URL/posts/$POST_ID")
echo "Post Details: $POST_DETAILS"

echo "=== Verification Complete ==="
