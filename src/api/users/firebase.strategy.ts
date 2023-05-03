import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { CONFIG } from 'src/config';

// TODO: check for potential performance bottleneck (does it request smth from 3rd oparty?)
@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase',
) {
  private defaultApp: any;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(CONFIG.FIREBASE),
    });
  }

  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        // console.log('Failed to check authentication', err);
        throw new UnauthorizedException("We don't know you. You have to login");
      });
    if (!firebaseUser) {
      throw new UnauthorizedException('Dafuq?');
    }
    return firebaseUser;
  }
}
