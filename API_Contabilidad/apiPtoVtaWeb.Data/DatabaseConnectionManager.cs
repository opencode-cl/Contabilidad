using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
public class DatabaseConnectionManager
{
    private readonly string _connectionString;
    private MySqlConnection _connection;

    public DatabaseConnectionManager(string connectionString)
    {
        _connectionString = connectionString;
        _connection = new MySqlConnection(_connectionString);
    }

    public MySqlConnection GetConnection()
    {
        if (_connection.State == System.Data.ConnectionState.Closed)
        {
            _connection.Open();
        }
        return _connection;
    }
}
