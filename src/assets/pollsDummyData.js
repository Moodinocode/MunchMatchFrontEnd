const polls = [
  {
    id: "poll1",
    title: "Favorite Programming Language",
    CreatedBy: "admin1",
    Multi: true,
    PollOptions: [
      {
        title: "JavaScript",
        Details: {
          description: "Most popular language for web development",
          imgLink: "https://example.com/js.png",
          Categories: ["Web", "Frontend"]
        },
        Voters: [
          {
            id: 1,
            name: "Alice Smith",
            email: "alice@company.com",
            profileImageLink: "https://outlook.office.com/photo/alice"
          },
          {
            id: 2,
            name: "Bob Johnson",
            email: "bob@company.com",
            profileImageLink: "https://outlook.office.com/photo/bob"
          }
        ]
      },
      {
        title: "Python",
        Details: {
          description: "Popular for data science and scripting",
          imgLink: "https://example.com/python.png",
          Categories: ["Backend", "AI"]
        },
        Voters: []
      },
      {
        title: "Java",
        Details: {
          description: "Widely used in enterprise and Android apps",
          imgLink: "https://example.com/java.png",
          Categories: ["Backend", "Mobile"]
        },
        Voters: [
          {
            id: 3,
            name: "Charlie King",
            email: "charlie@company.com",
            profileImageLink: "https://outlook.office.com/photo/charlie"
          }
        ]
      }
    ]
  },

  {
    id: "poll2",
    title: "Best Vacation Spot",
    CreatedBy: "admin2",
    Multi: false,
    PollOptions: [
      {
        title: "Bali",
        Details: {
          description: "Tropical paradise in Indonesia",
          imgLink: "https://example.com/bali.png",
          Categories: ["Beach", "Nature"]
        },
        Voters: [
          {
            id: 4,
            name: "Dana Lee",
            email: "dana@company.com",
            profileImageLink: "https://outlook.office.com/photo/dana"
          }
        ]
      },
      {
        title: "Paris",
        Details: {
          description: "The city of love and art",
          imgLink: "https://example.com/paris.png",
          Categories: ["City", "Culture"]
        },
        Voters: []
      }
    ]
  },

  {
    id: "poll3",
    title: "Choose Your Favorite Framework",
    CreatedBy: "admin3",
    Multi: true,
    PollOptions: [
      {
        title: "React",
        Details: {
          description: "Library by Facebook",
          imgLink: "https://example.com/react.png",
          Categories: ["Frontend"]
        },
        Voters: [
          {
            id: 5,
            name: "Eva Green",
            email: "eva@company.com",
            profileImageLink: "https://outlook.office.com/photo/eva"
          },
          {
            id: 6,
            name: "Frank Hall",
            email: "frank@company.com",
            profileImageLink: "https://outlook.office.com/photo/frank"
          }
        ]
      },
      {
        title: "Vue",
        Details: {
          description: "Progressive JavaScript framework",
          imgLink: "https://example.com/vue.png",
          Categories: ["Frontend"]
        },
        Voters: []
      },
      {
        title: "Angular",
        Details: {
          description: "Full-fledged framework by Google",
          imgLink: "https://example.com/angular.png",
          Categories: ["Frontend", "Fullstack"]
        },
        Voters: [
          {
            id: 7,
            name: "Grace Kim",
            email: "grace@company.com",
            profileImageLink: "https://outlook.office.com/photo/grace"
          }
        ]
      },
      {
        title: "Svelte",
        Details: {
          description: "Compiles to efficient JavaScript",
          imgLink: "https://example.com/svelte.png",
          Categories: ["Frontend"]
        },
        Voters: []
      }
    ]
  }
];


export default polls