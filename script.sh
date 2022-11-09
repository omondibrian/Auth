#! bin/bash
PROTO_DEST_final=./dist/src/proto
PROTO_DEST_dev=./src/proto
mkdir -p ${PROTO_DEST_final}
mkdir -p ${PROTO_DEST_dev}

# TypeScript code generation
npx grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=${PROTO_DEST_dev} \
    -I ./ *.proto

# JavaScript code generation
npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:${PROTO_DEST_final} \
    --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
    --grpc_out=grpc_js:${PROTO_DEST_final} \
    -I ./ *.proto