wait_container_to_be_running() {
match=$1
until docker ps | grep -qm 1 $match;
  do
    echo "waiting docker '$match' container to be running..."
    sleep 0.1
  done
}