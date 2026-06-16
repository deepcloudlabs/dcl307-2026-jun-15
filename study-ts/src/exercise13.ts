type User = {id: number, name: string};

interface UserRepository {
    getUser(id: number): Promise<User>;
    createUser(user: User): Promise<User>;
}

class MongoDBUserRepository implements UserRepository {
    async getUser(id: number): Promise<User> {
        return {id, name: "jack"};
    }

    createUser(user: User): Promise<User> {
        return Promise.resolve(user);
    }


}

class UserService {
    constructor(private readonly userRepository: UserRepository) {

    }

    async addUser(user: User) : Promise<User> {
        return this.userRepository.createUser(user);
    }
}

let userRepository = new MongoDBUserRepository();
let userService = new UserService(userRepository);
userService.addUser({id: 1, name: "jack"}).then(user => console.log(user));