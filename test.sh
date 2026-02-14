#!/bin/bash

# Base URLs
USERS_URL="http://localhost:3000/api/users"
POSTS_URL="http://localhost:3000/api/posts"
FOLLOW_URL="http://localhost:3000/api"
LIKES_URL="http://localhost:3000/api/likes"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo "Request: $method $endpoint"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    if [ "$method" = "GET" ]; then
        curl -s -X $method "$endpoint" | jq .
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq .
    fi
    echo ""
}

# User-related functions
test_get_all_users() {
    print_header "Testing GET all users"
    make_request "GET" "$USERS_URL"
}

test_get_user() {
    print_header "Testing GET user by ID"
    read -p "Enter user ID: " user_id
    make_request "GET" "$USERS_URL/$user_id"
}

test_create_user() {
    print_header "Testing POST create user"
    read -p "Enter first name: " firstName
    read -p "Enter last name: " lastName
    read -p "Enter email: " email
    
    local user_data=$(cat <<EOF
{
    "firstName": "$firstName",
    "lastName": "$lastName",
    "email": "$email"
}
EOF
)
    make_request "POST" "$USERS_URL" "$user_data"
}

test_update_user() {
    print_header "Testing PUT update user"
    read -p "Enter user ID to update: " user_id
    read -p "Enter new first name (press Enter to keep current): " firstName
    read -p "Enter new last name (press Enter to keep current): " lastName
    read -p "Enter new email (press Enter to keep current): " email
    
    local update_data="{"
    local has_data=false
    
    if [ -n "$firstName" ]; then
        update_data+="\"firstName\": \"$firstName\""
        has_data=true
    fi
    
    if [ -n "$lastName" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"lastName\": \"$lastName\""
        has_data=true
    fi
    
    if [ -n "$email" ]; then
        if [ "$has_data" = true ]; then
            update_data+=","
        fi
        update_data+="\"email\": \"$email\""
        has_data=true
    fi
    
    update_data+="}"
    
    make_request "PUT" "$USERS_URL/$user_id" "$update_data"
}

test_delete_user() {
    print_header "Testing DELETE user"
    read -p "Enter user ID to delete: " user_id
    make_request "DELETE" "$USERS_URL/$user_id"
}

# Post-related functions
test_create_post() {
    print_header "Testing POST create post"
    read -p "Enter user ID (author): " userId
    read -p "Enter post content (hashtags supported): " content
    
    local post_data=$(cat <<EOF
{
    "userId": $userId,
    "content": "$content"
}
EOF
)
    make_request "POST" "$POSTS_URL" "$post_data"
}

test_get_all_posts() {
    print_header "Testing GET all posts"
    make_request "GET" "$POSTS_URL"
}

test_get_post() {
    print_header "Testing GET post by ID"
    read -p "Enter post ID: " postId
    make_request "GET" "$POSTS_URL/$postId"
}

test_update_post() {
    print_header "Testing PUT update post"
    read -p "Enter post ID: " postId
    read -p "Enter new content: " content
    
    local post_data=$(cat <<EOF
{
    "content": "$content"
}
EOF
)
    make_request "PUT" "$POSTS_URL/$postId" "$post_data"
}

test_delete_post() {
    print_header "Testing DELETE post"
    read -p "Enter post ID: " postId
    make_request "DELETE" "$POSTS_URL/$postId"
}

# Follow-related functions
test_follow_user() {
    print_header "Testing FOLLOW user"
    read -p "Enter follower user ID: " followerId
    read -p "Enter following user ID: " followingId
    
    local follow_data=$(cat <<EOF
{
    "followerId": $followerId,
    "followingId": $followingId
}
EOF
)
    make_request "POST" "$FOLLOW_URL/follow" "$follow_data"
}

test_unfollow_user() {
    print_header "Testing UNFOLLOW user"
    read -p "Enter follower user ID: " followerId
    read -p "Enter following user ID: " followingId
    
    local follow_data=$(cat <<EOF
{
    "followerId": $followerId,
    "followingId": $followingId
}
EOF
)
    make_request "POST" "$FOLLOW_URL/unfollow" "$follow_data"
}

test_get_followers() {
    print_header "Testing GET followers"
    read -p "Enter user ID: " userId
    make_request "GET" "$FOLLOW_URL/users/$userId/followers"
}

test_get_following() {
    print_header "Testing GET following"
    read -p "Enter user ID: " userId
    make_request "GET" "$FOLLOW_URL/users/$userId/following"
}

# Like-related functions
test_like_post() {
    print_header "Testing LIKE post"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    
    local like_data=$(cat <<EOF
{
    "userId": $userId,
    "postId": $postId
}
EOF
)
    make_request "POST" "$LIKES_URL" "$like_data"
}

test_unlike_post() {
    print_header "Testing UNLIKE post"
    read -p "Enter user ID: " userId
    read -p "Enter post ID: " postId
    
    local like_data=$(cat <<EOF
{
    "userId": $userId,
    "postId": $postId
}
EOF
)
    make_request "DELETE" "$LIKES_URL" "$like_data"
}


# Submenu functions
show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create new user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. Create post"
    echo "2. Get all posts"
    echo "3. Get post by ID"
    echo "4. Update post"
    echo "5. Delete post"
    echo "6. Back to main menu"
    echo -n "Enter your choice (1-6): "
}

show_follow_menu() {
    echo -e "\n${GREEN}Follow Menu${NC}"
    echo "1. Follow user"
    echo "2. Unfollow user"
    echo "3. Get followers"
    echo "4. Get following"
    echo "5. Back to main menu"
    echo -n "Enter your choice (1-5): "
}

show_likes_menu() {
    echo -e "\n${GREEN}Likes Menu${NC}"
    echo "1. Like post"
    echo "2. Unlike post"
    echo "3. Back to main menu"
    echo -n "Enter your choice (1-3): "
}

# Main menu
show_main_menu() {
    echo -e "\n${GREEN}API Testing Menu${NC}"
    echo "1. Users"
    echo "2. Posts"
    echo "3. Follows"
    echo "4. Likes"
    echo "5. Exit"
    echo -n "Enter your choice (1-5): "
}

# Main loop
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        2)
            while true; do
                show_posts_menu
                read post_choice
                case $post_choice in
                    1) test_create_post ;;
                    2) test_get_all_posts ;;
                    3) test_get_post ;;
                    4) test_update_post ;;
                    5) test_delete_post ;;
                    6) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        3)
            while true; do
                show_follow_menu
                read follow_choice
                case $follow_choice in
                    1) test_follow_user ;;
                    2) test_unfollow_user ;;
                    3) test_get_followers ;;
                    4) test_get_following ;;
                    5) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        4)
            while true; do
                show_likes_menu
                read like_choice
                case $like_choice in
                    1) test_like_post ;;
                    2) test_unlike_post ;;
                    3) break ;;
                    *) echo "Invalid choice. Please try again." ;;
                esac
            done
            ;;
        5) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
done 