(function (window) {
  const styles = `
  :root {
    --ra-color: #000000;
    --ra-primary: #0ad39a;
    --ra-background: #ffffff;
    --ra-border-radius: 6px;
  }
  .ra * { box-sizing: border-box; }
  .ra {
    color: var(--ra-color);
    background: var(--ra-background);
  }
  .ra a {
    color: var(--ra-primary);
    text-decoration: none;
  }
  .ra a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  .ra-wrapper {
    margin: 0 auto;
    padding: 16px;
    max-width: 800px;
  }
  .-altra .ra-error {
    color: #B91C1C;
    background: #FEE2E2;
    padding: 12px 16px;
    margin-bottom: 16px;
    border-radius: var(--ra-border-radius);
  }
  .ra .ra-button {
    color: #ffffff;
    background: var(--ra-primary);
    font-size: 14px;
    font-weight: bold;
    border: none;
    outline: none;
    padding: 12px 16px;
    border-radius: var(--ra-border-radius);
  }
  .ra .ra-button:hover {
    opacity: 0.8;
    cursor: pointer;
  }
  .ra .ra-label {
    display: block;
    font-size: 14px;
    margin: 16px 0 8px;
  }
  .ra .ra-label:first-child {
    margin-top: 0;
  }
  .ra .ra-input {
    border: 1px solid transparent;
    font-family: sans-serif;
    font-size: 14px;
    padding: 12px 16px;
    background: var(--ra-background-alt);
    border-radius: var(--ra-border-radius);
  }
  .ra .ra-input:focus {
    outline: none;
    border: 1px solid var(--ra-primary);
  }
  .ra .ra-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ra .ra-loading-inline {
    margin: 16px 0;
    padding: 80px 16px;
    text-align: center;
    background: var(--ra-background-alt);
    border-radius: var(--ra-border-radius);
  }
  .ra .ra-box {
    padding: 8px;
    border: 1px solid var(--ra-background-alt);
    border-radius: var(--ra-border-radius);
  }
  .ra .ra-tabs a {
    color: var(--ra-color);
    font-size: 18px;
    padding: 8px 32px 8px 0;
    border-radius: var(--ra-border-radius);
    text-decoration: none;
  }
  .ra .ra-tabs a.ra-tabs-active,
  .ra .ra-tabs a:hover {
    color: var(--ra-primary);
    text-decoration: none;
    cursor: pointer;
  }
  .ra .ra-proposal-tile {
    display: block;
    padding: 16px;
    color: var(--ra-color);
    background: var(--ra-background-alt);
    border-radius: var(--ra-border-radius);
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .ra .ra-proposal-tile:hover {
    opacity: 0.8;
    cursor: pointer;
    text-decoration: none;
  }
  .ra .ra-proposal-tile span {
    display: inline-block;
    margin-right: 8px;
    color: #bbbbbb;
  }
  @media (min-width: 700px) {
    .ra .ra-twocol {
      display: flex;
    }
    .ra .ra-twocol > div:nth-child(1) {
      flex: 1;
      padding-right: 32px;
    }
    .ra .ra-twocol > div:nth-child(2) {
      flex: 0 0 256px;
    }
  }
  `;

  const daoAbi = [
    "event Approval(address indexed,address indexed,uint256)",
    "event DelegateChanged(address indexed,address indexed,address indexed)",
    "event Executed(address indexed,uint256,bytes)",
    "event ExecutedProposal(uint256 indexed,uint256,address)",
    "event Proposed(uint256 indexed)",
    "event Snapshot(uint256)",
    "event Transfer(address indexed,address indexed,uint256)",
    "event ValueReceived(address indexed,uint256)",
    "event Voted(uint256 indexed,address indexed,uint256)",
    "function BALLOT_TYPEHASH() view returns (bytes32)",
    "function DOMAIN_TYPEHASH() view returns (bytes32)",
    "function adjustTotalWrapped(int256)",
    "function allowance(address,address) view returns (uint256)",
    "function approve(address,uint256) returns (bool)",
    "function balanceOf(address) view returns (uint256)",
    "function burn(address,uint256)",
    "function configure(string,string,address,address,uint256,uint256,uint256,uint256)",
    "function decimals() view returns (uint8)",
    "function delegate(address)",
    "function delegates(address) view returns (address)",
    "function execute(uint256)",
    "function lock(uint256)",
    "function minBalanceToPropose() view returns (uint256)",
    "function minExecutionDelay() view returns (uint256)",
    "function minPercentQuorum() view returns (uint256)",
    "function minVotingTime() view returns (uint256)",
    "function mint(address,uint256)",
    "function name() view returns (string)",
    "function proposal(uint256) view returns (uint256, address, string, uint256, uint256, uint256, uint256)",
    "function proposalDetails(uint256) view returns (string, uint256, uint256, string[], bytes[][], uint256[])",
    "function proposalVotes(uint256,address) view returns (uint256)",
    "function proposalsCount() view returns (uint256)",
    "function propose(string,string,uint256,uint256,string[],bytes[][]) returns (uint256)",
    "function snapshot() returns (uint256)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function totalSupplyAt(uint256) view returns (uint256)",
    "function totalWrapped() view returns (uint256)",
    "function transfer(address,uint256) returns (bool)",
    "function transferFrom(address,address,uint256) returns (bool)",
    "function unlock(uint256)",
    "function vote(uint256,uint256,uint8,bytes32,bytes32)",
    "function votesAt(address,uint256) view returns (uint256)",
    "function wrappedToken() view returns (address)",
  ];

  let state = {
    options: {},
    page: "proposals",
    pageArg: null,
  };

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  window.provider = provider; // debug
  let signer;
  async function getSigner() {
    if (signer) return signer;
    if (!window.ethereum) throw new Error("No web3 wallet found!");
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    });
    signer = provider.getSigner();
    return signer;
  }
  let daoContract;

  function cssDarken(color) {
    try {
      if (!color || color.length !== 7 || color[0] != "#") {
        throw new Error("Malformed color");
      }
      const r = parseInt(color.slice(1, 3), 16) - 16;
      const g = parseInt(color.slice(3, 5), 16) - 16;
      const b = parseInt(color.slice(5, 7), 16) - 16;
      return `rgba(${r},${g},${b})`;
    } catch (e) {
      return "#efefef";
    }
  }

  function formatAddress(a) {
    return a.slice(0, 6) + "..." + a.slice(-4);
  }

  const PageProposals = {
    oninit: async function () {
      this.loading = true;
      this.proposals = [];
      try {
        const proposalsCount = await daoContract.proposalsCount();
        for (
          let i = proposalsCount - 1;
          i >= 0 && i > proposalsCount - 10;
          i--
        ) {
          const proposal = await daoContract.proposals(i);
          this.proposals.push(proposal);
          console.log(proposal);
        }
      } finally {
        this.loading = false;
        m.redraw();
      }
    },
    view: function () {
      return m("div", {}, [
        m("div", { style: "display: flex;align-items: center;" }, [
          m("h1", { style: "flex: 1;" }, "Proposals"),
          m(
            "button.ra-button",
            { onclick: () => (state.page = "proposals-new") },
            "New Proposal"
          ),
        ]),
        this.loading ? m("div.ra-loading", {}, "Loading...") : null,
        this.proposals.map((p) =>
          m(
            "a.ra-proposal-tile",
            {
              onclick: () => {
                state.page = "proposal";
                state.pageArg = p[0].toNumber();
              },
            },
            [m("span", {}, "#" + (p[0].toNumber() + 1)), p[2]]
          )
        ),
      ]);
    },
  };

  const PageProposal = {
    oninit: async function () {
      this.proposal = await daoContract.proposals(state.pageArg);
      m.redraw();
    },
    view: function () {
      if (!this.proposal) {
        return m("div.ra-loading-inline", {}, "Loading...");
      }
      return m("div", {}, [
        m("div", { style: "display: flex;align-items: center;" }, [
          m(
            "h1",
            { style: "flex: 1;" },
            "#" + (this.proposal[0].toNumber() + 1) + " " + this.proposal[2]
          ),
          m(
            "button.ra-button",
            { onclick: () => (state.page = "proposals") },
            "Back"
          ),
        ]),
        m("div.ra-twocol", { style: "margin: 16px 0;" }, [
          m("div", {}, [
            m(
              "div",
              { style: "white-space: pre-wrap;margin-bottom: 16px;" },
              this.proposal[3]
            ),
            m("h3", {}, "Vote"),
            m("div.ra-box", { style: "margin-bottom: 8px;" }, ["For"]),
            m("div.ra-box", { style: "margin-bottom: 8px;" }, ["Against"]),
          ]),
          m("div", {}, [
            m("div.ra-box", { style: "" }, [
              m("b", {}, "Proposer: "),
              formatAddress(this.proposal[1].toString()),
            ]),
          ]),
        ]),
      ]);
    },
  };

  const PageProposalsNew = {
    oninit: function () {
      this.proposal = {
        title: "",
        description: "",
        options: [{ name: "For", actions: [{ to: "", value: "0", data: "" }] }],
      };
    },
    view: function () {
      const onCreate = async () => {
        if (this.loading) return;
        try {
          this.loading = true;
          const signer = await getSigner();
          if (!this.proposal.title) {
            throw new Error("Missing title");
          }
          if (!this.proposal.description) {
            throw new Error("Missing description");
          }
          if (this.proposal.options.length === 0) {
            throw new Error("Missing option");
          }
          const optionNames = [];
          const optionActions = [];
          for (let option of this.proposal.options) {
            if (!option.name) throw new Error("Missing option name");
            optionNames.push(option.name);
            const actions = [];
            for (let action of option.actions) {
              actions.push(
                ethers.utils.defaultAbiCoder.encode(
                  ["address", "uint", "bytes"],
                  [
                    action.to,
                    ethers.utils.parseEther(action.value),
                    action.data || "0x",
                  ]
                )
              );
            }
            optionActions.push(actions);
          }
          const votingTime = await daoContract.minVotingTime();
          const executionDelay = await daoContract.minExecutionDelay();
          await (
            await daoContract
              .connect(signer)
              .propose(
                this.proposal.title,
                this.proposal.description,
                votingTime,
                executionDelay,
                optionNames,
                optionActions
              )
          ).wait();
          const proposalId =
            (await daoContract.proposalsCount()).toNumber() - 1;
          state.page = "proposal";
          state.pageArg = proposalId;
          m.redraw();
        } catch (err) {
          this.error = err.message;
        } finally {
          this.loading = false;
          m.redraw();
        }
      };
      const onAddOption = () => {
        this.proposal.options.push({ name: "", actions: [] });
      };
      const onAddAction = (i) => {
        this.proposal.options[i].actions.push({ to: "", value: "0", data: "" });
      };
      const onRemoveOption = (i) => {
        this.proposal.options.splice(i, 1);
      };
      const onRemoveAction = (i, j) => {
        this.proposal.options[i].actions.splice(j, 1);
      };
      const onChangeKey = (obj, key, e) => {
        obj[key] = event.target.value;
      };

      return m("div", {}, [
        this.loading ? m("div.ra-loading", {}, "Loading...") : null,
        m("div", { style: "display: flex;align-items: center;" }, [
          m("h1", { style: "flex: 1;" }, "New Proposal"),
          m(
            "button.ra-button",
            { onclick: () => (state.page = "proposals") },
            "Back"
          ),
        ]),
        this.error ? m("div.ra-error", {}, this.error) : null,
        m("div.ra-twocol", {}, [
          m("div", {}, [
            m("label.ra-label", {}, "Title"),
            m("input.ra-input", {
              style: "width:100%",
              value: this.proposal.title,
              onchange: (e) => (this.proposal.title = e.target.value),
            }),
            m("label.ra-label", {}, "Description"),
            m(
              "textarea.ra-input",
              {
                rows: "20",
                style: "width:100%",
                onchange: (e) => (this.proposal.description = e.target.value),
              },
              this.proposal.description
            ),
            m(
              "div",
              { style: "text-align: right;margin-top: 16px;" },
              m("button.ra-button", { onclick: onCreate }, "Submit")
            ),
          ]),
          m("div", {}, [
            m("label.ra-label", {}, "Options"),
            this.proposal.options.map((o, i) =>
              m("div.ra-box", { style: "margin-bottom: 8px;" }, [
                m("label.ra-label", {}, [
                  "Name",
                  m(
                    "a",
                    {
                      style: "float: right;",
                      onclick: onRemoveOption.bind(this, i),
                    },
                    "Remove"
                  ),
                ]),
                m("input.ra-input", {
                  style: "width:100%",
                  value: o.name,
                  onchange: onChangeKey.bind(this, o, "name"),
                }),
                o.actions.map((a, j) =>
                  m("div.ra-box", { style: "margin-top: 8px;" }, [
                    m("label.ra-label", {}, [
                      "To (address)",
                      m(
                        "a",
                        {
                          style: "float: right;",
                          onclick: onRemoveAction.bind(this, i, j),
                        },
                        "Remove"
                      ),
                    ]),
                    m("input.ra-input", {
                      style: "width:100%",
                      to: a.to,
                      onchange: onChangeKey.bind(this, a, "to"),
                      placeholder: "0xbeef...",
                    }),
                    m("label.ra-label", {}, "Value (in Ether)"),
                    m("input.ra-input", {
                      style: "width:100%",
                      value: a.value,
                      onchange: onChangeKey.bind(this, a, "value"),
                      placeholder: "0.0",
                    }),
                    m("label.ra-label", {}, "Data"),
                    m(
                      "textarea.ra-input",
                      {
                        rows: "2",
                        style: "width:100%",
                        onchange: onChangeKey.bind(this, a, "data"),
                        placeholder: "0x0000...0000...0001",
                      },
                      a.data
                    ),
                  ])
                ),
                m(
                  "div",
                  { style: "margin-top: 8px;text-align: center;" },
                  m("a", { onclick: onAddAction.bind(this, i) }, "Add action")
                ),
              ])
            ),
            m("div.ra-box", {}, [
              m("label.ra-label", {}, "Name"),
              m("input.ra-input", {
                style: "width:100%",
                value: "Against",
                disabled: true,
              }),
            ]),
            m(
              "div",
              { style: "margin-top: 16px;text-align: center;" },
              m("a", { onclick: onAddOption }, "Add option")
            ),
          ]),
        ]),
      ]);
    },
  };

  const PageTreasury = {
    view: function () {
      return m("div", {}, [
        m("div", { style: "display: flex;align-items: center;" }, [
          m("h1", { style: "flex: 1;" }, "Treasury"),
        ]),
      ]);
    },
  };

  const PageToken = {
    view: function () {
      return m("div", {}, [
        m("div", { style: "display: flex;align-items: center;" }, [
          m("h1", { style: "flex: 1;" }, "Voting Token"),
        ]),
      ]);
    },
  };

  const App = {
    view: function () {
      let optionsStyles = ":root {";
      if (state.options.color) {
        optionsStyles += `--ra-color: ${state.options.color};`;
      }
      if (state.options.primaryColor) {
        optionsStyles += `--ra-primary: ${state.options.primaryColor};`;
      }
      if (state.options.backgroundColor) {
        optionsStyles += `--ra-background: ${state.options.backgroundColor};`;
      }
      if (state.options.borderRadius) {
        optionsStyles += `--ra-border-radius: ${state.options.borderRadius};`;
      }
      optionsStyles += `--ra-background-alt: ${cssDarken(
        state.options.backgroundColor
      )}`;
      optionsStyles += "}";

      let pageEl = m("h3", { style: "text-align: center" }, "Page Not Found");
      if (state.page === "proposals") {
        pageEl = m(PageProposals);
      }
      if (state.page === "proposal") {
        pageEl = m(PageProposal);
      }
      if (state.page === "proposals-new") {
        pageEl = m(PageProposalsNew);
      }
      if (state.page === "treasury") {
        pageEl = m(PageTreasury);
      }
      if (state.page === "token") {
        pageEl = m(PageToken);
      }

      return m("div.ra", {}, [
        m("style", null, styles + optionsStyles),
        m("div.ra-wrapper", {}, [
          m("div.ra-tabs", {}, [
            m(
              "a" + (state.page === "proposals" ? ".ra-tabs-active" : ""),
              { onclick: () => (state.page = "proposals") },
              "Proposals"
            ),
            m(
              "a" + (state.page === "treasury" ? ".ra-tabs-active" : ""),
              { onclick: () => (state.page = "treasury") },
              "Treasury"
            ),
            m(
              "a" + (state.page === "token" ? ".ra-tabs-active" : ""),
              { onclick: () => (state.page = "token") },
              "Voting Token"
            ),
          ]),
          pageEl,
          m(
            "div",
            { style: "color: #bbbbbb;" },
            "DAO Address: " + state.options.address
          ),
        ]),
      ]);
    },
  };

  function setupRa(rootEl, options) {
    state.rootEl = rootEl;
    state.options = options;

    let loading = 1;
    function onLoad() {
      loading--;
      if (loading === 0) {
        daoContract = new ethers.Contract(options.address, daoAbi, provider);
        window.daoContract = daoContract; // debug
        m.mount(rootEl, App);
      }
    }
    function loadScript(url, cb) {
      loading++;
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.onload = cb;
      document.head.append(script);
    }
    if (!ethers) {
      loadScript("https://cdn.ethers.io/lib/ethers-5.2.umd.min.js", onLoad);
    }
    if (!m && !m.mount) {
      loadScript("https://unpkg.com/mithril/mithril.js", onLoad);
    }
    onLoad();
  }

  window.setupRa = setupRa;
})(window);
