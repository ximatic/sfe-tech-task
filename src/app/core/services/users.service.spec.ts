import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import {
  MOCK_PASSWORD_1,
  MOCK_USER_1,
  MOCK_USER_2,
} from '../../../../__mocks__/constants/user.const.mock';

import { User } from '../../shared/models/user';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let httpMock: HttpTestingController;

  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UsersService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);

    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('getting users works', fakeAsync(() => {
      const mockData: User[] = [MOCK_USER_1, MOCK_USER_2];
      const expectedResponse: User[] = [MOCK_USER_1, MOCK_USER_2];
      let serviceResponse!: User[];

      service.getUsers().subscribe((users: User[]) => {
        serviceResponse = users;
      });

      const req = httpMock.expectOne(`api/users`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('GET');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  describe('addUser', () => {
    it('adding user works', fakeAsync(() => {
      const mockData: User = MOCK_USER_1;
      const expectedResponse: User = MOCK_USER_1;
      let serviceResponse!: User;

      service
        .addUser({ ...MOCK_USER_1, password: MOCK_PASSWORD_1 })
        .subscribe((user: User) => {
          serviceResponse = user;
        });

      const req = httpMock.expectOne(`api/users/create`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('POST');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });

  describe('editUser', () => {
    it('editing user works', fakeAsync(() => {
      const mockData: User = MOCK_USER_1;
      const expectedResponse: User = MOCK_USER_1;
      let serviceResponse!: User;

      service
        .editUser({ ...MOCK_USER_1, password: MOCK_PASSWORD_1 })
        .subscribe((user: User) => {
          serviceResponse = user;
        });

      const req = httpMock.expectOne(`api/users/${MOCK_USER_1.id}`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('PUT');
      expect(serviceResponse).toEqual(expectedResponse);
    }));
  });
});
