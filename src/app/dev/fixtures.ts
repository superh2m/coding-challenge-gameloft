import mongooseClient from '../../infra/mongodb/mongooseClient';
import { Forum } from '../../domain/document/forum';
import { ForumUser, Role } from '../../domain/document/forumUser';
import { ForumMessage } from '../../domain/document/forumMessage';
import { User } from '../../domain/document/user';
import { AnyObject, Connection, Model } from 'mongoose';
import { Authenticator } from './authenticator';

interface IData {
    reference: string;
    input: Record<string, string|boolean|Date>;
    toCollection?: IToCollection;
}

interface IFixture {
    type: typeof Model;
    data: IData[];
}

interface IToCollection {
    reference: string;
    path: string;
}

interface IReference {
    reference: string;
    document: AnyObject;
}

const fixtures: Record<string, IFixture> = {
  Forum: {
    type: Forum,
    data: [
      {
        reference: '@forum-songpop-2',
        input: {
          name: 'SongPop 2',
          isPrivate: false
        }
      },
      {
        reference: '@forum-songpop-3',
        input: {
          name: 'SongPop 3',
          isPrivate: false
        }
      },
      {
        reference: '@forum-songpop-4',
        input: {
          name: 'SongPop 4',
          isPrivate: false
        }
      },
      {
        reference: '@forum-songpop-5',
        input: {
          name: 'SongPop 5',
          isPrivate: false
        }
      },
      {
        reference: '@forum-songpop-6',
        input: {
          name: 'SongPop 6',
          isPrivate: true
        }
      }
    ]
  },
  User: {
    type: User,
    data: [
      {
        reference: '@user-Hama',
        input: {
          firstName: 'Hama',
          lastName: 'Mohamed Mahmoud',
          email: Authenticator.DEFAULT_USER_EMAIL,
          picture: 'https://i.ibb.co/Zx00P8y/1603798081542.png'
        }
      },
      {
        reference: '@user-Alexandre',
        input: {
          firstName: 'Alexandre',
          lastName: 'Gareau',
          email: 'alexandre.gareau@gameloft.com',
          picture: 'https://media-exp1.licdn.com/dms/image/C4D03AQEwbKM506oQ6A/profile-displayphoto-shrink_800_800/0/1631049339386?e=1657756800&v=beta&t=8vv0C3uLAABecP3oV0t2a4QLG4raiGfR4aDUQCAaycU'
        }
      },
      {
        reference: '@user-Gustavo',
        input: {
          firstName: 'Gustavo',
          lastName: 'Rondón Linares',
          email: 'gustavo.rondon-linares@gameloft.com',
          picture: 'https://media-exp1.licdn.com/dms/image/C4E03AQH0U_ZtFsg63w/profile-displayphoto-shrink_800_800/0/1643380405985?e=1657756800&v=beta&t=3z1JtVUjVAXfRmBKWvARJLJD3p-M6lBocaPlKFYfYKs'
        }
      },
      {
        reference: '@user-Mauricio',
        input: {
          firstName: 'Mauricio',
          lastName: 'Coniglio',
          email: 'mauricio.coniglio@gameloft.com',
          picture: 'https://media-exp1.licdn.com/dms/image/C4E03AQFqP_bIB7nO4w/profile-displayphoto-shrink_800_800/0/1579554875803?e=1657756800&v=beta&t=dBJZxRfrwzSG0pWpN5UP6JVnqj2jKLoDM73cqQlUBQg'
        }
      },
      {
        reference: '@user-Cole',
        input: {
          firstName: 'Cole',
          lastName: 'Davison',
          email: 'cole.davison@gameloft.com',
          picture: 'https://media-exp1.licdn.com/dms/image/C4E03AQFHkLRDKmeL2g/profile-displayphoto-shrink_800_800/0/1630582912796?e=1657756800&v=beta&t=agP9khqpth69eMqUz_pVf0kSJZ0SDd8440SOl981DoA'
        }
      },
      {
        reference: '@user-Céline',
        input: {
          firstName: 'Céline',
          lastName: 'Lapouge',
          email: 'celine.lapouge@gameloft.com',
          picture: 'https://media-exp1.licdn.com/dms/image/C4E03AQHDb-OHpOUIfg/profile-displayphoto-shrink_800_800/0/1517262943071?e=1657756800&v=beta&t=MQZ3T6oCkoykBWtF_ahaeJ_nk-0_2tEqJt2VR5yjnDs'
        }
      },
      {
        reference: '@user-Johanna',
        input: {
          firstName: 'Johanna',
          lastName: 'Grossmann',
          email: 'johanna.grossmann@gameloft.com',
          picture: 'https://media-exp1.licdn.com/dms/image/C4E03AQHuu5vSqn_hMA/profile-displayphoto-shrink_800_800/0/1517400898949?e=1657756800&v=beta&t=-I7YPhQHyniPYRyiI9wVuKQ67W_2YcxLKk0YreHA-YE'
        }
      },
      {
        reference: '@user-Olivier',
        input: {
          firstName: 'Olivier',
          lastName: 'Michon',
          email: 'olivier.michon@gameloft.com',
          picture: 'https://media-exp1.licdn.com/dms/image/C5103AQGgULRhf-4KUw/profile-displayphoto-shrink_800_800/0/1516938786645?e=1657756800&v=beta&t=S2BrIRdC4NgT5hzoXGBTnw1v1-SH8fI4XHYQMFssrEk'
        }
      },
      {
        reference: '@user-Jocelyn',
        input: {
          firstName: 'Jocelyn',
          lastName: 'Fung',
          email: 'jocelyn.fung@gameloft.com',
          picture: 'https://media-exp1.licdn.com/dms/image/C4D03AQGj__SkRtmntw/profile-displayphoto-shrink_800_800/0/1554938861454?e=1657756800&v=beta&t=hl9idYBb4pyH5U8C58HSCTwXvKYeo3Sv9JyWgJgbfQc'
        }
      }
    ]
  },
  ForumUser: {
    type: ForumUser,
    data: [
      {
        reference: '@forum-user-songpop2-Céline',
        input: {
          role: Role.ADMIN,
          user: '@user-Céline',
          forum: '@forum-songpop-2'
        },
        toCollection: {
          reference: '@forum-songpop-2',
          path: 'forumUsers'
        }
      },
      {
        reference: '@forum-user-songpop2-Alexandre',
        input: {
          role: Role.PARTICIPANT,
          user: '@user-Alexandre',
          forum: '@forum-songpop-2'
        },
        toCollection: {
          reference: '@forum-songpop-2',
          path: 'forumUsers'
        }
      },
      {
        reference: '@forum-user-songpop2-Gustavo',
        input: {
          role: Role.PARTICIPANT,
          user: '@user-Gustavo',
          forum: '@forum-songpop-2'
        },
        toCollection: {
          reference: '@forum-songpop-2',
          path: 'forumUsers'
        }
      },
      {
        reference: '@forum-user-songpop2-Mauricio',
        input: {
          role: Role.PARTICIPANT,
          user: '@user-Mauricio',
          forum: '@forum-songpop-2'
        },
        toCollection: {
          reference: '@forum-songpop-2',
          path: 'forumUsers'
        }
      },
      {
        reference: '@forum-user-songpop3-Olivier',
        input: {
          role: Role.ADMIN,
          user: '@user-Olivier',
          forum: '@forum-songpop-3'
        },
        toCollection: {
          reference: '@forum-songpop-3',
          path: 'forumUsers'
        }
      },
      {
        reference: '@forum-user-songpop3-Cole',
        input: {
          role: Role.PARTICIPANT,
          user: '@user-Cole',
          forum: '@forum-songpop-3'
        },
        toCollection: {
          reference: '@forum-songpop-3',
          path: 'forumUsers'
        }
      },
      {
        reference: '@forum-user-songpop3-Johanna',
        input: {
          role: Role.PARTICIPANT,
          user: '@user-Johanna',
          forum: '@forum-songpop-3'
        },
        toCollection: {
          reference: '@forum-songpop-3',
          path: 'forumUsers'
        }
      },
      {
        reference: '@forum-user-songpop3-Jocelyn',
        input: {
          role: Role.PARTICIPANT,
          user: '@user-Jocelyn',
          forum: '@forum-songpop-3'
        },
        toCollection: {
          reference: '@forum-songpop-3',
          path: 'forumUsers'
        }
      }
    ]
  },
  ForumMessage: {
    type: ForumMessage,
    data: [
      {
        reference: '@forum-songpop-2-Céline-message-1',
        input: {
          content: 'Hi Team :)\nSongPop 2 is out and we are so excited!',
          forum: '@forum-songpop-2',
          forumUser: '@forum-user-songpop2-Céline',
          sendedAt: new Date('2015-07-01 13:00:00')
        }
      },
      {
        reference: '@forum-songpop-2-Alexandre-message-1',
        input: {
          content: 'So coooool',
          forum: '@forum-songpop-2',
          forumUser: '@forum-user-songpop2-Alexandre',
          sendedAt: new Date('2015-07-01 13:45:00')
        }
      },
      {
        reference: '@forum-songpop-2-Gustavo-message-1',
        input: {
          content: 'I hope people will enjoy it!',
          forum: '@forum-songpop-2',
          forumUser: '@forum-user-songpop2-Gustavo',
          sendedAt: new Date('2015-07-01 14:00:00')
        }
      },
      {
        reference: '@forum-songpop-2-Mauricio-message-1',
        input: {
          content: ':D',
          forum: '@forum-songpop-2',
          forumUser: '@forum-user-songpop2-Mauricio',
          sendedAt: new Date('2015-07-01 14:15:00')
        }
      },
      {
        reference: '@forum-songpop-3-Olivier-message-1',
        input: {
          content: 'Hello World! Our new game, SongPop 3, is finally out, we made it :)',
          forum: '@forum-songpop-3',
          forumUser: '@forum-user-songpop3-Olivier',
          sendedAt: new Date('2021-03-18 13:00:00')
        }
      },
      {
        reference: '@forum-songpop-3-Cole-message-1',
        input: {
          content: 'A lot of work, congrats folks!',
          forum: '@forum-songpop-3',
          forumUser: '@forum-user-songpop3-Cole',
          sendedAt: new Date('2021-03-18 13:15:00')
        }
      },
      {
        reference: '@forum-songpop-3-Johanna-message-1',
        input: {
          content: 'I now know how I will spend my Sunday afternoons',
          forum: '@forum-songpop-3',
          forumUser: '@forum-user-songpop3-Johanna',
          sendedAt: new Date('2021-03-18 13:30:00')
        }
      },
      {
        reference: '@forum-songpop-3-Jocelyn-message-1',
        input: {
          content: 'We are the best team ever!!',
          forum: '@forum-songpop-3',
          forumUser: '@forum-user-songpop3-Jocelyn',
          sendedAt: new Date('2021-03-18 13:45:00')
        }
      },
      {
        reference: '@forum-songpop-3-Olivier-message-2',
        input: {
          content: 'Be ready, lots of downloads to come',
          forum: '@forum-songpop-3',
          forumUser: '@forum-user-songpop3-Olivier',
          sendedAt: new Date('2021-03-18 14:00:00')
        }
      },
    ]
  },
};
const references: IReference[] = [];

const replaceReference = ((input: Record<string, string|boolean|Date|AnyObject>): Record<string, string|boolean|Date|AnyObject> => {
  for (const key in input) {
    if (typeof input[key] === 'string' && String(input[key]).startsWith('@')) {
      for (let i = 0; i < references.length; i++) {
        if (references[i].reference === input[key]) {
          input[key] = references[i].document;
        }
      }
    }
  }

  return input;
});

const findReference = ((searchReference: string): IReference => {
  return references.find(reference => reference.reference === searchReference);
});

const loadFixtures = (async () => {
  const dbConnection: Connection = await mongooseClient();

  await dbConnection.dropDatabase();

  for (const document in fixtures) {
    const documentFixtures = fixtures[document];

    for (let i = 0; i < documentFixtures.data.length; i++) {
      const input = replaceReference(documentFixtures.data[i].input);
      const toCollectionConfig: IToCollection = documentFixtures.data[i].toCollection;
      // eslint-disable-next-line
            const newDocument: AnyObject = await new documentFixtures.type(input);
      // eslint-disable-next-line
            await newDocument.save();

      references.push({
        reference: documentFixtures.data[i].reference,
        document: newDocument
      });

      if (typeof toCollectionConfig !== 'undefined') {
        const collectionReference: IReference = findReference(toCollectionConfig.reference);
        // eslint-disable-next-line
                collectionReference.document[toCollectionConfig.path].push(newDocument);
        // eslint-disable-next-line
                await collectionReference.document.save();
      }
    }
  }

  await dbConnection.close();
});

void loadFixtures();
