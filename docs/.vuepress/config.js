// config.js
module.exports = {
    title: "流光不加少",
    description: 'A simple and beautiful vuepress blog theme.',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: '流光不加少',
    theme: 'reco',
    themeConfig: {
        type: 'blog',
        blogConfig: {
            category: {
                location: 2, // 在导航栏菜单中所占的位置，默认2
                text: 'Category', // 默认文案 “分类”
            },
            tag: {
                location: 3, // 在导航栏菜单中所占的位置，默认3
                text: 'Tag', // 默认文案 “标签”
            },
        },
        lastUpdated: '最近更新',
        // valine: {
        //     appId: '',
        //     appKey: '',
        // },
        nav: [{
                text: 'Home',
                link: '/',
                icon: 'reco-home'
            },
            {
                text: 'Notes',
                link: '/note/',
                icon: 'reco-document'
            },
            {
                text: 'TimeLine',
                link: '/timeline/',
                icon: 'reco-date'
            },
            {
                text: 'About',
                link: '/about/',
                icon: 'reco-account'
            },
            {
                text: 'GitHub',
                link: 'https://github.com/HyanCat',
                icon: 'reco-github'
            }
        ],
        friendLink: [{
            title: '若古社区',
            desc: '最优秀的古风文化社区',
            email: 'zhangmen@ruogoo.cn',
            logo: 'https://o.ruogoo.cn/image/82d617748d6c1373ec29a4565b7ba102.png',
            link: 'https://ruogoo.cn'
        }, ],
        // 备案
        record: '京ICP备14006825号-1',
        recordLink: 'https://beian.miit.gov.cn/',
        startYear: '2013',
        search: true,
        searchMaxSuggestions: 10,
        noFoundPageByTencent: false
    },
}
