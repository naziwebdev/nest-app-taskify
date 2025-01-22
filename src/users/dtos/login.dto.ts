import {
    IsString,
    IsNotEmpty,
    Matches,
  } from 'class-validator';
  
  export class LoginDto {
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
      message: 'Phone number must be a valid format.',
    })
    phone: string;
  
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
      message:
        'password must be at least 8 char and contains number/char/capital-char',
    })
    password: string;
  }
  