class UserController {
    private static instance: UserController;

    public getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }
}

export default UserController;