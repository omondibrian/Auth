import { IEmailServer } from '@Auth/src/proto/notification_grpc_pb';
import { emailReturnPayload, Imail } from '@Auth/src/proto/notification_pb';
import { handleUnaryCall } from '@grpc/grpc-js';
import { config } from 'dotenv';

import NotificationService from '.';

config();
const notification = new NotificationService({
  user: process.env.SMTP_USER?.trim() as string,
  hostSMTP: process.env.SMTP_HOST?.trim() as string,
  password: process.env.SMTP_PASSWORD?.trim() as string,
});
export class EmailServiceServer implements IEmailServer {
  [name: string]: import("@grpc/grpc-js").UntypedHandleCall;
  sendMail: handleUnaryCall<Imail, emailReturnPayload> = async (
    call,
    cb
  ): Promise<void> => {
    const body = call.request;
    console.log("processing email request to %s", body.getTo());
    try {
      const result = await notification.send({
        to: body.getTo(),
        from: body.getFrom(),
        subject: body.getSubject(),
        body: body.getMessage(),
        text: body.getMessage(),
      });
      console.log(result);
      const emailObj = new emailReturnPayload();
      emailObj.setId(result.messageId);
      emailObj.setMessage(result.msg);
      cb(null, emailObj);
    } catch (error: any) {
      console.log(error);
      cb(error, null);
    }
  };
}
