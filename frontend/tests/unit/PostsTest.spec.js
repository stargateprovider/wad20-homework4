import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import moment from 'moment'

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({data: testData})
}));

describe('Posts', () => {
    const wrapper = mount(Posts, {router, store, localVue});

    it("should render as many posts as defined in testData", () => {
        expect(wrapper.findAll(".post").length).toBe(testData.length)
    });

    it("should render each post's media according to its type", () => {
        const foundPosts = wrapper.findAll(".post");

        for (var i = 0; i < foundPosts.length; i++) {
            let media = foundPosts.at(i).find(".post-image");

            if (!testData[i].media) {
                expect(media.exists()).toBe(false);
            } else if (testData[i].media.type == "image") {
                expect(media.find("img").exists()).toBe(true);
            } else if (testData[i].media.type == "video") {
                expect(media.find("video").exists()).toBe(true);
            }
        }
    });

    it("should render post dates in the correct format", () => {
        wrapper.findAll(".post-author>small:last-child").filter(item =>
            expect(moment(item.text(), 'LLLL', true).isValid()).toBe(true)
        );
    });
});