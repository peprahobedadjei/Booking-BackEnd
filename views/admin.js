const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin View</title>
      <link rel="stylesheet" href="https://cdn.datatables.net/1.11.3/css/jquery.dataTables.min.css">
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.min.js"></script>
    </head>
    <body>
      <h1>Admin View</h1>
      <table id="ticketTable" class="display">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ticket Number</th>
            <th>Ticket Type</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Total</th>
            <th>Transaction Screenshot</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

      <script>
        $(document).ready(function() {
          $.getJSON('/admin/data', function(data) {
            const table = $('#ticketTable').DataTable({
              data: data,
              columns: [
                { data: 'id' },
                { data: 'ticketNumber' },
                { data: 'ticketType' },
                { data: 'name' },
                { data: 'email' },
                { data: 'phone' },
                { data: 'amount' },
                { data: 'total' },
                { data: 'transactionScreenshot', render: function(data, type, row) {
                    return \`<img src="\${data}" width="100" alt="Screenshot">\`;
                  }
                }
              ]
            });
          });
        });
      </script>
    </body>
    </html>
  `);
});

module.exports = router;
