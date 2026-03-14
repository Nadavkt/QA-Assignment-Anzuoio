using UnityEngine;
using UnityEngine.UI;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Collections.Generic;

public class ClientManger : MonoBehaviour
{
    public Text consoleText;

    TcpClient client;
    NetworkStream stream;
    Thread receiveThread;

    bool connected = false;

    Queue<string> messageQueue = new Queue<string>();

    void Log(string message)
    {
        Debug.Log(message);

        if (consoleText != null)
        {
            consoleText.text += "\n" + message;
        }
    }

    public void ConnectToServer()
    {
        if (connected) return;

        try
        {
            client = new TcpClient("127.0.0.1", 4000);
            stream = client.GetStream();

            connected = true;

            Log("Connected to server");

            SendMessageToServer("HELLO");

            receiveThread = new Thread(ReceiveMessages);
            receiveThread.IsBackground = true;
            receiveThread.Start();
        }
        catch (System.Exception e)
        {
            Log("Connection failed: " + e.Message);
        }
    }

    void ReceiveMessages()
    {
        byte[] buffer = new byte[1024];

        while (connected)
        {
            int bytes = stream.Read(buffer, 0, buffer.Length);

            if (bytes == 0) continue;

            string message = Encoding.UTF8.GetString(buffer, 0, bytes).Trim();

            lock (messageQueue)
            {
                messageQueue.Enqueue("Server: " + message);
            }
        }
    }

    void Update()
    {
        lock (messageQueue)
        {
            while (messageQueue.Count > 0)
            {
                string msg = messageQueue.Dequeue();
                Log(msg);
            }
        }
    }

    public void SendPing()
    {
        SendMessageToServer("PING");
    }

    public void SpawnEnemy()
    {
        SendMessageToServer("SPAWN_ENEMY");
    }

    public void MovePlayer()
    {
        SendMessageToServer("MOVE_PLAYER");
    }

    public void ChangeColor()
    {
        SendMessageToServer("CHANGE_COLOR");
    }

    void SendMessageToServer(string message)
    {
        if (!connected) return;

        string line = message + "\n";
        byte[] data = Encoding.UTF8.GetBytes(line);

        stream.Write(data, 0, data.Length);

        Log("Client: " + message);
    }

    void OnApplicationQuit()
    {
        connected = false;

        if (receiveThread != null)
            receiveThread.Abort();

        if (stream != null)
            stream.Close();

        if (client != null)
            client.Close();
    }
}