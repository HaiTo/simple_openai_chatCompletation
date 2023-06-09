# ベースイメージを指定 (Node.js LTSバージョン)
FROM node:lts

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# TypeScriptをJavaScriptにコンパイル
RUN npm run build

# 環境変数を設定 (必要に応じて変更してください)
ENV PORT 3000

# アプリケーションを起動
CMD [ "node", "app.js" ]
