import sys

# Define the data to pass back
data_to_pass_back = 'Send this to node process.'

# Read the input from the command-line arguments
input_data = sys.argv[1]

# Print the data to pass back to the node process
print(data_to_pass_back)

# Ensure the output is flushed to the stdout
sys.stdout.flush()
