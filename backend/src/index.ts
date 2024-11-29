import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bookRoutes from './routes/bookRoutes'; // 引入书籍路由

// 加载 .env 文件中的环境变量
config();

const app = express();

// 配置跨域和解析请求体
app.use(cors());
app.use(express.json({ limit: '50mb' })); // 增加 JSON 请求体的大小限制
app.use(express.urlencoded({ limit: '50mb', extended: true })); // 支持更大的 URL 编码数据

// MongoDB 连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://root:123456!@cluster0.g8sci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// 连接 MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// 测试路由
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Large JSON Support!');
});

// 注册书籍路由
app.use('/api/books', bookRoutes);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
