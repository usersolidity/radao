(function (window) {
  const styles = `
  :root {
    --ra-color: #000000;
    --ra-color-muted: #bbbbbb;
    --ra-primary: #0ad39a;
    --ra-background: #ffffff;
    --ra-border-radius: 6px;
  }
  .ra * { box-sizing: border-box; }
  .ra {
    color: var(--ra-color);
    background: var(--ra-background);
    line-height: 1.4;
  }
  .ra a {
    color: var(--ra-primary);
    text-decoration: none;
  }
  .ra a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  .ra-text-muted {
    color: var(--ra-color-muted);
  }
  .ra-text-primary {
    color: var(--ra-primary);
  }
  .ra-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ra-wrapper {
    margin: 0 auto;
    padding: 16px;
    max-width: 800px;
  }
  .ra .ra-error {
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
    color: var(--ra-color-muted);
    font-size: 18px;
    text-align: center;
    border: 2px solid var(--ra-background-alt);
    border-radius: var(--ra-border-radius);
  }
  .ra .ra-box {
    padding: 8px;
    border: 2px solid var(--ra-background-alt);
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
    padding: 8px;
    color: var(--ra-color);
    border: 2px solid var(--ra-background-alt);
    border-radius: var(--ra-border-radius);
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .ra .ra-proposal-tile:hover {
    opacity: 0.8;
    cursor: pointer;
    text-decoration: none;
  }
  .ra .ra-proposal-tile > span {
    display: inline-block;
    margin-right: 8px;
    color: var(--ra-color-muted);
  }
  .ra .ra-proposal-tile-status {
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    padding: 4px 8px;
    margin-left: 8px;
    background: var(--ra-background-alt);
    border-radius: var(--ra-border-radius);
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
    .ra .ra-twocol-even {
      display: flex;
    }
    .ra .ra-twocol-even > div {
      flex: 1;
    }
    .ra .ra-twocol-even > div:nth-child(1) {
      padding-right: 32px;
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
    "function voters() view returns (address)",
    "function wrappedToken() view returns (address)",
  ];

  const erc20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function allowance(address,address) view returns (uint256)",
    "function approve(address,uint) returns (bool)",
    "function transfer(address,uint) returns (bool)",
  ];

  const ADDRESS_ZERO = "0x" + "0".repeat(40);
  const ZERO_BYTES32 = "0x" + "0".repeat(64);

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

  function formatDate(epoch) {
    const d = new Date(epoch.toNumber() * 1000);
    if (d.getTime() === 0) return "N/A";
    const pad = (s) => ("0" + s).slice(-2);
    return [
      d.getFullYear() + "-",
      pad(d.getMonth() + 1) + "-",
      pad(d.getDate()) + " ",
      pad(d.getHours()) + ":",
      pad(d.getMinutes()),
    ].join("");
  }

  function navigate(page, arg) {
    state.page = page;
    state.pageArg = arg;
    window.location.hash = page + (arg ? "/" + arg : "");
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
          const proposal = await daoContract.proposal(i);
          this.proposals.push(proposal);
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
            { onclick: () => navigate("proposals-new") },
            "New Proposal"
          ),
        ]),
        this.loading ? m("div.ra-loading", {}, "Loading...") : null,
        this.proposals.map((p) =>
          m(
            "a.ra-proposal-tile",
            {
              onclick: () => navigate("proposal", p[0].toNumber()),
            },
            [
              m("span", {}, "#" + (p[0].toNumber() + 1)),
              p[2],
              m(
                "div",
                { style: "float: right;font-size: 14px;font-weight: normal;" },
                [
                  formatDate(p[3]),
                  m(
                    "span.ra-proposal-tile-status",
                    {},
                    Date.now() < p[3].toNumber() * 1000
                      ? "Voting"
                      : p[6].toNumber() != 0
                      ? "Executed"
                      : "Pending"
                  ),
                ]
              ),
            ]
          )
        ),
      ]);
    },
  };

  const PageProposal = {
    oninit: function () {
      this.load();
    },

    load: async function () {
      // [id, proposer, title, startAt, endAt, executableAt, executedAt]
      this.proposal = await daoContract.proposal(state.pageArg);
      // [description, snapshotId, votersSupply, oNames, oActions, oVotes]
      this.proposalDetails = await daoContract.proposalDetails(state.pageArg);

      this.signer = await getSigner();
      this.signerAddress = await this.signer.getAddress();
      this.votedFor = (
        await daoContract.proposalVotes(state.pageArg, this.signerAddress)
      ).toNumber();
      console.log("debug pd", this.proposal, this.proposalDetails);
      m.redraw();
    },

    handleVote: async function (i) {
      const tx = await daoContract
        .connect(this.signer)
        .vote(this.proposal[0], i, 0, ZERO_BYTES32, ZERO_BYTES32);
      await tx.wait();
      this.votedFor = i + 1;
      m.redraw();
    },

    handleExecute: async function () {
      try {
        const signer = await getSigner();
        const tx = await daoContract.connect(signer).execute(state.pageArg);
        await tx.wait();
        this.load();
      } catch (err) {
        console.error(err);
        alert(err?.data?.message || err.message);
      }
    },

    renderVoteButton: function (i) {
      if (this.votedFor === i + 1) {
        return m("b", { style: "margin-left: 8px;" }, "Voted");
      }
      if (this.votedFor || Date.now() > this.proposal[4].toNumber() * 1000) {
        return null;
      }
      return m(
        "button.ra-button",
        {
          style: "padding: 4px 8px;margin-left: 8px;",
          onclick: this.handleVote.bind(this, i),
        },
        "Vote"
      );
    },

    view: function () {
      function renderAction(a, i) {
        const [target, value, data] = ethers.utils.defaultAbiCoder.decode(
          ["address", "uint", "bytes"],
          a
        );
        return m("div.ra-box", { key: i, style: "margin-top: 4px;" }, [
          m("div.ra-truncate", { title: target }, "Target: " + target),
          m("div", {}, "Value: " + ethers.utils.formatEther(value)),
          m("div.ra-truncate", {}, "Data: " + data),
        ]);
      }

      if (!this.proposal) {
        return m("div.ra-loading-inline", {}, "Loading...");
      }
      return m("div", {}, [
        m("div", { style: "display: flex;align-items: center;" }, [
          m("h1", { style: "flex: 1;margin-bottom: 0;" }, [
            m(
              "span.ra-text-muted",
              {},
              "#" + (this.proposal[0].toNumber() + 1)
            ),
            " " + this.proposal[2],
          ]),
          m(
            "button.ra-button",
            { onclick: () => navigate("proposals") },
            "Back"
          ),
        ]),
        m("div.ra-twocol", { style: "margin: 16px 0;" }, [
          m("div", { style: "overflow: hidden;" }, [
            m(
              "div.ra-box",
              { style: "white-space: pre-wrap;margin-bottom: 16px;" },
              this.proposalDetails[0]
            ),
            m("h3", {}, "Vote"),
            this.proposalDetails[3].map((name, i) =>
              m("div.ra-box", { key: i, style: "margin-bottom: 8px;" }, [
                m("div", { style: "display: flex;" }, [
                  m("div", { style: "flex:1;" }, name),
                  m(
                    "div.ra-text-primary",
                    {},
                    ethers.utils.formatUnits(this.proposalDetails[5][i], 18) +
                      " votes"
                  ),
                  this.renderVoteButton(i),
                ]),
                this.proposalDetails[4][i].map(renderAction.bind(this)),
              ])
            ),
          ]),
          m("div", {}, [
            m("div.ra-box", { style: "" }, [
              [
                ["Proposer", formatAddress(this.proposal[1].toString())],
                ["Starts", formatDate(this.proposal[3])],
                ["Ends", formatDate(this.proposal[4])],
                ["Executable", formatDate(this.proposal[5])],
                ["Executed", formatDate(this.proposal[6])],
                ["Supply", ethers.utils.formatEther(this.proposalDetails[2])],
                ["Snapshot ID", this.proposalDetails[1].toNumber().toString()],
              ].map((row) =>
                m("div", { style: "display:flex;" }, [
                  m(
                    "div",
                    { style: "font-weight:bold;flex:1;" },
                    row[0] + ": "
                  ),
                  m("div", { style: "text-align:right;" }, row[1]),
                ])
              ),
              Date.now() > this.proposal[5].toNumber() * 1000
                ? m("a", { onclick: this.handleExecute.bind(this) }, "Execute")
                : null,
            ]),
          ]),
        ]),
      ]);
    },
  };

  const PageProposalsNew = {
    oninit: function () {
      this.againstName = "Against";
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
          optionNames.push(this.againstName);
          optionActions.push([]);
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
          navigate("proposal", proposalId);
          m.redraw();
        } catch (err) {
          if ((err?.data?.message || "").includes("<balance")) {
            const minBalance = ethers.utils.formatEther(
              await daoContract.minBalanceToPropose()
            );
            this.error = `You need at least ${minBalance} tokens to propose`;
          } else {
            this.error = err.message;
          }
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
            { onclick: () => navigate("proposals") },
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
                value: this.againstName,
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
    oninit: async function () {
      this.tokens = [
        {
          id: "eth",
          chain: "eth",
          name: "ETH",
          symbol: "ETH",
          display_symbol: null,
          optimized_symbol: "ETH",
          decimals: 18,
          logo_url:
            "https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png",
          price: 2158.73,
          is_verified: true,
          is_core: true,
          is_wallet: true,
          time_at: 1483200000,
          amount: 0.40433976773323665,
        },
        {
          id: "0x6b175474e89094c44da98b954eedeac495271d0f",
          chain: "eth",
          name: "Dai Stablecoin",
          symbol: "DAI",
          display_symbol: null,
          optimized_symbol: "DAI",
          decimals: 18,
          logo_url:
            "https://static.debank.com/image/token/logo_url/0x6b175474e89094c44da98b954eedeac495271d0f/549c4205dbb199f1b8b03af783f35e71.png",
          price: 1,
          is_verified: true,
          is_core: true,
          is_wallet: true,
          time_at: 1573672677,
          amount: 0.05209338,
        },
      ];

      this.usdValue = (
        await fetch(
          "https://openapi.debank.com/v1/user/chain_balance?chain_id=eth&id=" +
            daoContract.address
        ).then((r) => r.json())
      ).usd_value;
      m.redraw();

      // id,name,symbol,decimals,logo_url,price,amount
      /*
      this.tokens = await fetch(
        "https://openapi.debank.com/v1/user/token_list?chain_id=eth&is_all=true&id=" +
          daoContract.address
      ).then((r) => r.json()).sort((a, b) => (a.amount*a.price - b.amount-a.price));
      */
      m.redraw();
    },

    handleTransfer: async function (tokenSymbol, tokenAddress, decimals) {
      try {
        const target = prompt("Address to send to:");
        if (!target) return;
        const amountText = prompt("Amount to send:");
        if (!amountText) return;
        const amount = ethers.utils.parseUnits(amountText, decimals);

        let transferAction;
        if (tokenAddress == "eth") {
          transferAction = ethers.utils.defaultAbiCoder.encode(
            ["address", "uint", "bytes"],
            [target, amount, "0x"]
          );
        } else {
          const actionData = new ethers.utils.Interface(
            erc20Abi
          ).encodeFunctionData("transfer", [target, amount]);
          transferAction = ethers.utils.defaultAbiCoder.encode(
            ["address", "uint", "bytes"],
            [tokenAddress, "0", actionData]
          );
        }
        const votingTime = await daoContract.minVotingTime();
        const executionDelay = await daoContract.minExecutionDelay();
        const title =
          "Transfer " +
          ethers.utils.formatUnits(amount, decimals) +
          " " +
          tokenSymbol;
        await (
          await daoContract
            .connect(await getSigner())
            .propose(
              title,
              title + " to " + target,
              votingTime,
              executionDelay,
              ["Transfer", "Do Not Transfer"],
              [[transferAction], []]
            )
        ).wait();
        const proposalId = (await daoContract.proposalsCount()).toNumber() - 1;
        navigate("proposal", proposalId);
        m.redraw();
      } catch (err) {
        console.log(err);
        alert("Error: " + err.message);
      }
    },

    view: function () {
      if (typeof this.usdValue === "undefined") {
        return m("div.ra-loading-inline", {}, "Loading...");
      }
      return m("div", {}, [
        m("div", { style: "display: flex;align-items: center;" }, [
          m("h1", { style: "flex: 1;margin-bottom: 0;" }, "Treasury"),
        ]),
        m("h3", { style: "margin-bottom: 8px;" }, "USD Value"),
        m(
          "div.ra-box",
          { style: "text-align: center;font-size: 22px;padding: 16px 0;" },
          "$ " + this.usdValue.toFixed(2)
        ),
        m("h3", { style: "margin-bottom: 8px;" }, "Assets"),
        this.tokens.map((t) =>
          m("div.ra-box", { style: "display: flex;margin-bottom: 8px;" }, [
            m("div", { style: "flex: 1;display: flex;align-items: center;" }, [
              m("img", {
                src:
                  t.logo_url ||
                  "https://etherscan.io/images/main/empty-token.png",
                style: "width: 24px;height: 24px;margin-right: 8px;",
              }),
              m(
                "b",
                { style: "margin-right: 8px;" },
                `${t.name} (${t.symbol})`
              ),
              t.amount.toFixed(4),
            ]),
            m("div", {}, [
              "$ " + (t.amount * t.price).toFixed(2),
              m(
                "button.ra-button",
                {
                  style: "padding: 4px 8px;margin-left: 8px;",
                  onclick: this.handleTransfer.bind(
                    this,
                    t.symbol,
                    t.id,
                    t.decimals
                  ),
                },
                "Transfer"
              ),
            ]),
          ])
        ),
      ]);
    },
  };

  const PageToken = {
    oninit: async function () {
      this.newDelegate = "";
      this.lockAmount = "";
      this.unlockAmount = "";

      const signer = await getSigner();
      this.signerAddress = await signer.getAddress();
      this.delegate = await daoContract.delegates(this.signerAddress);

      const votingTokenAddress = await daoContract.voters();
      this.votingTokenContract = new ethers.Contract(
        votingTokenAddress,
        erc20Abi,
        provider
      );
      this.votingTokenName = await this.votingTokenContract.name();
      this.votingTokenSymbol = await this.votingTokenContract.symbol();
      this.votingTokenTotalSupply = parseFloat(
        ethers.utils.formatUnits(await this.votingTokenContract.totalSupply())
      );
      this.totalWrapped = parseFloat(
        ethers.utils.formatUnits(await daoContract.totalWrapped())
      );

      const wrappedTokenAddress = await daoContract.wrappedToken();
      if (wrappedTokenAddress != ADDRESS_ZERO) {
        this.wrappedTokenContract = new ethers.Contract(
          wrappedTokenAddress,
          erc20Abi,
          provider
        );
        this.wrappedTokenName = await this.wrappedTokenContract.name();
        this.wrappedTokenSymbol = await this.wrappedTokenContract.symbol();
        this.wrappedTokenTotalSupply = parseFloat(
          ethers.utils.formatUnits(
            await this.wrappedTokenContract.totalSupply()
          )
        );
      }

      this.loadBalances();
    },

    loadBalances: async function () {
      this.votingTokenBalance = await this.votingTokenContract.balanceOf(
        this.signerAddress
      );
      if (this.wrappedTokenContract) {
        this.wrappedTokenBalance = await this.wrappedTokenContract.balanceOf(
          this.signerAddress
        );
        this.wrappedTokenAllowance = await this.wrappedTokenContract.allowance(
          this.signerAddress,
          daoContract.address
        );
      }
      m.redraw();
    },

    lockEstimate: function () {
      return (
        ((parseFloat(this.lockAmount) || 0) * this.votingTokenTotalSupply) /
        this.totalWrapped
      );
    },

    unlockEstimate: function () {
      return (
        ((parseFloat(this.unlockAmount) || 0) * this.totalWrapped) /
        this.votingTokenTotalSupply
      );
    },

    handleSetDelegate: async function (e) {
      e.preventDefault();
      const contract = daoContract.connect(await getSigner());
      await contract.delegate(this.newDelegate);
      this.delegate = this.newDelegate;
      this.newDelegate = "";
      m.redraw();
    },

    handleLock: async function (e) {
      e.preventDefault();

      if (this.wrappedTokenAllowance.lte(ethers.constants.Zero)) {
        const token = this.wrappedTokenContract.connect(await getSigner());
        await (
          await token.approve(daoContract.address, ethers.constants.MaxUint256)
        ).wait();
        this.loadBalances();
        return;
      }

      const contract = daoContract.connect(await getSigner());
      const tx = await contract.lock(ethers.utils.parseEther(this.lockAmount));
      this.lockAmount = "";
      m.redraw();
      await tx.wait();
      this.loadBalances();
    },

    handleUnlock: async function (e) {
      e.preventDefault();
      const contract = daoContract.connect(await getSigner());
      const tx = await contract.unlock(
        ethers.utils.parseEther(this.unlockAmount)
      );
      this.unlockAmount = "";
      m.redraw();
      await tx.wait();
      this.loadBalances();
    },

    view: function () {
      if (!this.votingTokenBalance) {
        return m("div.ra-loading-inline", {}, "Loading...");
      }
      return m("div", {}, [
        m("div", { style: "display: flex;align-items: center;" }, [
          m("h1", { style: "flex: 1;" }, "Voting Token"),
        ]),
        m("div.ra-twocol-even", { style: "margin-bottom: 16px;" }, [
          m("div", {}, [
            m(
              "h2",
              { style: "margin: 0 0 8px;" },
              this.votingTokenName + " (" + this.votingTokenSymbol + ")"
            ),
            m(
              "div.ra-box",
              { style: "text-align: center;font-size: 22px;padding: 16px 0;" },
              ethers.utils.formatEther(this.votingTokenBalance)
            ),
            m("h3", { style: "margin: 16px 0 8px;" }, "Delegate Voting Power"),
            m("div.ra-box", { style: "padding: 16px;" }, [
              m("div", { style: "margin-bottom: 8px;" }, [
                m("b", {}, "Delegating To: "),
                formatAddress(this.delegate),
              ]),
              m("input.ra-input", {
                style: "width: 100%;display: block;margin-bottom: 8px;",
                placeholder: "0x0000...",
                value: this.newDelegate,
                onchange: (e) => (this.newDelegate = e.target.value),
              }),
              m(
                "button.ra-button",
                {
                  style: "width: 100%;display: block;",
                  onclick: this.handleSetDelegate.bind(this),
                },
                "Update Delegate"
              ),
            ]),
          ]),
          this.wrappedTokenContract
            ? m("div", {}, [
                m(
                  "h2",
                  { style: "margin: 0 0 8px;" },
                  this.wrappedTokenName + " (" + this.wrappedTokenSymbol + ")"
                ),
                m(
                  "div.ra-box",
                  {
                    style:
                      "text-align: center;font-size: 22px;padding: 16px 0;",
                  },
                  ethers.utils.formatEther(this.wrappedTokenBalance || 0)
                ),
                m(
                  "h3",
                  { style: "margin: 16px 0 8px;" },
                  `Lock ${this.wrappedTokenSymbol} for ${this.votingTokenSymbol}`
                ),
                m("div.ra-box", { style: "padding: 16px;" }, [
                  m("input.ra-input", {
                    style: "width: 100%;display: block;margin-bottom: 8px;",
                    placeholder: "0.0",
                    value: this.lockAmount,
                    onchange: (e) => (this.lockAmount = e.target.value),
                  }),
                  m(
                    "button.ra-button",
                    {
                      style: "width: 100%;display: block;",
                      onclick: this.handleLock.bind(this),
                    },
                    this.wrappedTokenAllowance.lte(ethers.constants.Zero)
                      ? "Approve"
                      : "Lock for " +
                          this.lockEstimate().toFixed(3) +
                          " " +
                          this.votingTokenSymbol
                  ),
                ]),
                m(
                  "h3",
                  { style: "margin: 16px 0 8px;" },
                  `Unlock ${this.votingTokenSymbol} for ${this.wrappedTokenSymbol}`
                ),
                m("div.ra-box", { style: "padding: 16px;" }, [
                  m("input.ra-input", {
                    style: "width: 100%;display: block;margin-bottom: 8px;",
                    placeholder: "0.0",
                    value: this.unlockAmount,
                    onchange: (e) => (this.unlockAmount = e.target.value),
                  }),
                  m(
                    "button.ra-button",
                    {
                      style: "width: 100%;display: block;",
                      onclick: this.handleUnlock.bind(this),
                    },
                    "Unlock for " +
                      this.unlockEstimate().toFixed(3) +
                      " " +
                      this.wrappedTokenSymbol
                  ),
                ]),
              ])
            : m("div", {}, [
                m("h2", { style: "margin: 0 0 8px;" }, "Total Supply"),
                m(
                  "div.ra-box",
                  {
                    style:
                      "text-align: center;font-size: 22px;padding: 16px 0;",
                  },
                  this.votingTokenTotalSupply.toFixed(0)
                ),
              ]),
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
              { onclick: () => navigate("proposals") },
              "Proposals"
            ),
            m(
              "a" + (state.page === "treasury" ? ".ra-tabs-active" : ""),
              { onclick: () => navigate("treasury") },
              "Treasury"
            ),
            m(
              "a" + (state.page === "token" ? ".ra-tabs-active" : ""),
              { onclick: () => navigate("token") },
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
        if (window.location.hash) {
          const [page, arg] = window.location.hash.slice(1).split("/");
          if (
            ["proposal", "proposals-new", "treasury", "token"].includes(page)
          ) {
            navigate(page, arg);
          }
        }
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
