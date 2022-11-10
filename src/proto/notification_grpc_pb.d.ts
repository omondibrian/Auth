// package: Notification
// file: notification.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as notification_pb from "./notification_pb";

interface IEmailService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sendMail: IEmailService_IsendMail;
}

interface IEmailService_IsendMail extends grpc.MethodDefinition<notification_pb.Imail, notification_pb.emailReturnPayload> {
    path: "/Notification.Email/sendMail";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<notification_pb.Imail>;
    requestDeserialize: grpc.deserialize<notification_pb.Imail>;
    responseSerialize: grpc.serialize<notification_pb.emailReturnPayload>;
    responseDeserialize: grpc.deserialize<notification_pb.emailReturnPayload>;
}

export const EmailService: IEmailService;

export interface IEmailServer extends grpc.UntypedServiceImplementation {
    sendMail: grpc.handleUnaryCall<notification_pb.Imail, notification_pb.emailReturnPayload>;
}

export interface IEmailClient {
    sendMail(request: notification_pb.Imail, callback: (error: grpc.ServiceError | null, response: notification_pb.emailReturnPayload) => void): grpc.ClientUnaryCall;
    sendMail(request: notification_pb.Imail, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: notification_pb.emailReturnPayload) => void): grpc.ClientUnaryCall;
    sendMail(request: notification_pb.Imail, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: notification_pb.emailReturnPayload) => void): grpc.ClientUnaryCall;
}

export class EmailClient extends grpc.Client implements IEmailClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public sendMail(request: notification_pb.Imail, callback: (error: grpc.ServiceError | null, response: notification_pb.emailReturnPayload) => void): grpc.ClientUnaryCall;
    public sendMail(request: notification_pb.Imail, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: notification_pb.emailReturnPayload) => void): grpc.ClientUnaryCall;
    public sendMail(request: notification_pb.Imail, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: notification_pb.emailReturnPayload) => void): grpc.ClientUnaryCall;
}
