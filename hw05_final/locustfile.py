from locust import HttpUser, task


class HelloWorldUser(HttpUser):

    @task
    def index_page(self):
        self.client.get("")
        self.client.get("/profile/leo/")
        self.client.get("/posts/24/")
