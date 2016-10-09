#!/bin/bash

# Server key from: https://console.firebase.google.com/project/push-example-4bd5a/settings/cloudmessaging
server_key=AIzaSyDC6v7Os7_Pq-3j1bE1hh543h8et_T81Ps

# ID of a subscriber (from the subscribe event)
sub_id=eJtAo7wPS_Q:APA91bFvKhri-A8CGIWQ1Ihp_L_SK1D2_1u-mjrKjXb2h9EU1kWq6RG7TbJsIU_Lp8k0RaaAnWkQHhXuZ6FH0AjBOHbQUt9t6DoXVqLEcL7_faEKF40LPDjuAtdTHJJ0VYLwH4r2Q-SD

echo
echo "// ========================= //"
echo "// Sending push notification //"
echo "// ========================= //"
echo
echo "FCM Server Key:"
echo $server_key
echo
echo "Subscription ID:"
echo $sub_id
echo
echo curl --header "Authorization: key=$server_key" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"$sub_id\"]}"
echo

curl --header "Authorization: key=$server_key" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"$sub_id\"]}"
echo
echo