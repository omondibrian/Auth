// package: Notification
// file: notification.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class emailReturnPayload extends jspb.Message { 
    getId(): string;
    setId(value: string): emailReturnPayload;
    getMessage(): string;
    setMessage(value: string): emailReturnPayload;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): emailReturnPayload.AsObject;
    static toObject(includeInstance: boolean, msg: emailReturnPayload): emailReturnPayload.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: emailReturnPayload, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): emailReturnPayload;
    static deserializeBinaryFromReader(message: emailReturnPayload, reader: jspb.BinaryReader): emailReturnPayload;
}

export namespace emailReturnPayload {
    export type AsObject = {
        id: string,
        message: string,
    }
}

export class Imail extends jspb.Message { 
    getTo(): string;
    setTo(value: string): Imail;
    getFrom(): string;
    setFrom(value: string): Imail;
    getSubject(): string;
    setSubject(value: string): Imail;
    getMessage(): string;
    setMessage(value: string): Imail;
    getText(): string;
    setText(value: string): Imail;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Imail.AsObject;
    static toObject(includeInstance: boolean, msg: Imail): Imail.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Imail, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Imail;
    static deserializeBinaryFromReader(message: Imail, reader: jspb.BinaryReader): Imail;
}

export namespace Imail {
    export type AsObject = {
        to: string,
        from: string,
        subject: string,
        message: string,
        text: string,
    }
}
