#!/bin/bash
while :
do
  echo "Iniciando Nagi Bot com reinício automático..."
  node index.js
  echo "Bot caiu, reiniciando em 2 segundos..."
  sleep 2
done