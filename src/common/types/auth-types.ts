import { ApiProperty } from '@nestjs/swagger';

export type Enable2FAType = {
  secret: string;
};

export class FASecret {
  @ApiProperty({
    example: 'MZHDG6ZKF43XMQDLIZFT6MCTJBVVORK3IERXMNKMIZZUMORDLM4Q',
    description: '2fa secret',
  })
  secret: 'MZHDG6ZKF43XMQDLIZFT6MCTJBVVORK3IERXMNKMIZZUMORDLM4Q';
}

export class LoginResponse {
  @ApiProperty({
    example: 'asdfalsdkjflk4roiwekjsdofleaskdmflkadmsflkamdsf',
    description: 'access_code',
  })
  access_code: 'asdfalsdkjflk4roiwekjsdofleaskdmflkadmsflkamdsf;ojads;flkjm';
}
