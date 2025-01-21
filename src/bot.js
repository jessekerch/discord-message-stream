import { Client, Events, GatewayIntentBits } from "discord.js";
import cors from "cors";
import express from "express";

import config from "./../config/config.json" assert { type: "json" };

const app = express();

app.use(cors());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// confirming client is ready
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const messages = [];

client.on(Events.MessageCreate, (message) => {
  console.log("New message created: ", message.content);

  if (message.content === "ping") {
    message.channel.send("Pong");
  }

  if (!message.author.bot) {
    messages.push({
      author: message.author.username,
      content: message.content,
    });
    console.log(`Message from ${message.author.username}: ${message.content}`);
  }
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.listen(3000, () => {
  console.log("Backend server is running at http://localhost:3000");
});

// Log in to Discord
client.login(config.token);
