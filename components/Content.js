import ErrorMessage from "./ErrorMessage";
import { withRouter } from "next/router";
import Head from "next/head";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Markdown from "markdown-to-jsx";
import NewsSummary from "./NewsSummary";
import { Container, Row, Col } from "./shared/Grid";
import VenueTeaser from "./VenueTeaser";
import Jobs from "./Jobs";
import Hero from "./Hero";
import HeroBG from "./HeroBG";
import SpeakersList from "./speaker/SpeakersList";
import Backlink from "./Backlink";
import { SpeakerImage, SpeakerSocials } from "./speaker/SpeakerLink";
import NewsList from "./NewsList";
import Sponsors from "./Sponsors";
import RestaurantsList from "./RestaurantsList";
import HotelsList from "./HotelsList";

const currentPageQuery = gql`
  query($slug: String!) {
    collection: pageCollection(where: { slug: $slug }) {
      items {
        title
        lead
        body
        slug
        menu
        menuButton
        showIntro
        showNews
        showSpeakers
        showVenue
        showSponsorshipCategories
        showSponsors
        showSponsorsDetailed
        showWorkshops
        showTeam
        showJobs
        showJobsDetailed
        showSchedule
        showHotels
        showRestaurants
        bodyClass
        menuClass
        ctaText
        specialPage
        config
        leadCtasCollection {
          items {
            ctaText
            slug
          }
        }
      }
    }
  }
`;

const currentNewsQuery = gql`
  query($slug: String!) {
    collection: newsCollection(where: { slug: $slug }) {
      items {
        title
        date
        body
        slug
        tagsCollection {
          items {
            title
          }
        }
      }
    }
  }
`;

// TODO find better way to map content fields, instead duplicating it
const currentSpeakerQuery = gql`
  query($slug: String!) {
    collection: speakerCollection(where: { slug: $slug }) {
      items {
        title: name
        lead: description
        body: bio
        name
        description
        slug
        photo {
          url(transform: { width: 294, height: 395, resizeStrategy: FILL })
        }
        linkedin
        twitter
        website
      }
    }
  }
`;

export default withRouter(({ router: { query } }) => {
  const slug = query.slug || "/";
  const category = query.category;
  let template = "default";
  let dataQuery;

  let wideContent = false;
  let isHome = slug === "/";
  let isVenue = slug === "venue";

  // Root categories
  switch (slug) {
    case "venue":
    case "sponsors":
      wideContent = true;
    case "terms":
    case "jobs":
    case "code-of-conduct":
    case "privacy-policy":
    case "news":
    case "about":
    case "sponsorship":
      template = "list";
      break;
    default:
      break;
  }

  let backLink = {};
  let isSpeaker = category === "speakers";

  // Sub Categories
  switch (category) {
    case "speakers":
      template = "content";
      dataQuery = currentSpeakerQuery;
      backLink = {
        text: "Speakers",
        link: {
          href: { pathname: "/", query: { slug: "speakers" } },
          as: "/speakers"
        }
      };
      break;
    case "news":
      template = "content";
      dataQuery = currentNewsQuery;
      backLink = {
        text: "News",
        link: {
          href: { pathname: "/", query: { slug: "news" } },
          as: "/news"
        }
      };
      break;
    // case "speakers":
    // case "hosts":
    // case "workshops":
    default:
      dataQuery = currentPageQuery;
  }

  return (
    <Query query={dataQuery} variables={{ slug }}>
      {({ loading, error, data }) => {
        if (error) return <ErrorMessage message="Error loading pages." />;

        // Destructuring needs to be done outside the arguments to prevent mapping errors
        const {
          collection: {
            items: [currentPage]
          }
        } = data;
        if (!currentPage) return <Hero title="404 Page not found" />;

        let title = category
          ? `${category.charAt(0).toUpperCase()}${category.slice(1)}`
          : currentPage.title;
        const subTitle = category ? currentPage.title : null;
        const ctas = currentPage.leadCtasCollection
          ? currentPage.leadCtasCollection.items
          : null;

        const CustomHead = () => (
          <Head>
            <title>{isHome ? "" : `${title} – `}Front Conference Zurich</title>
            {currentPage.config && currentPage.config.scripts
              ? currentPage.config.scripts.map((src, i) => (
                  <script src={src} async key={i} />
                ))
              : null}
            {currentPage.config && currentPage.config.styles
              ? currentPage.config.styles.map((href, i) => (
                  <link rel="stylesheet" href={href} key={i} />
                ))
              : null}
          </Head>
        );

        switch (template) {
          case "list":
            return (
              <section
                className={loading ? "content content--loading" : "content"}
              >
                <CustomHead />
                <HeroBG />
                <Hero
                  title={title}
                  subTitle={subTitle}
                  lead={currentPage.lead}
                  ctas={ctas}
                  template={template}
                />
                <div className="content__white-wrapper">
                  <Container>
                    <Row>
                      <Col className="xs-12">
                        <div className="content__inner-wrapper">
                          {currentPage.body && (
                            <Row>
                              <Col
                                className={`xs-12 ${
                                  !wideContent
                                    ? "rg-10 offset-rg-1 lg-8 offset-lg-2"
                                    : ""
                                }`}
                              >
                                <div className="markdown-wrapper markdown-wrapper--list">
                                  <Markdown options={{ forceBlock: true }}>
                                    {currentPage.body}
                                  </Markdown>
                                </div>
                              </Col>
                            </Row>
                          )}

                          {currentPage.showVenue && (
                            <VenueTeaser isVenue={isVenue} />
                          )}
                          {currentPage.showNews && <NewsList />}
                          {currentPage.showHotels && <HotelsList />}
                          {currentPage.showRestaurants && <RestaurantsList />}
                          {currentPage.showSponsorsDetailed && (
                            <Sponsors details={true} />
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>

                {currentPage.showSponsors && (
                  <div className="dark-background">
                    <Container>
                      <Row>
                        <Col className="xs-12">
                          <Sponsors />
                        </Col>
                      </Row>
                    </Container>
                  </div>
                )}
              </section>
            );
          case "content":
            return (
              <section
                className={loading ? "content content--loading" : "content"}
              >
                <CustomHead />
                <Hero
                  title={title}
                  subTitle={subTitle}
                  lead={currentPage.lead}
                  ctas={ctas}
                  template={template}
                />

                <div className="content__white-wrapper">
                  <Backlink {...backLink} />

                  {(isSpeaker && (
                    <Container>
                      <Row className="content__floating-row">
                        <Col className="content__left xs-12 md-7 lg-6 offset-lg-1">
                          <div className="content-title">
                            <h1 className="content-title__title">
                              {currentPage.title}
                            </h1>
                            <p className="content-title__subtitle">
                              {currentPage.lead}
                            </p>
                          </div>
                        </Col>
                        <Col className="content__right xs-12 sm-10 rg-8 md-4 offset-right-lg-1 lg-3">
                          <Row>
                            <Col className="xs-7 offset-xs-1 md-12 offset-md-0">
                              <SpeakerImage speaker={currentPage} />
                            </Col>
                            <Col className="xs-3 offset-xs-1 md-12 offset-md-0">
                              <SpeakerSocials speaker={currentPage} />
                            </Col>
                          </Row>
                        </Col>
                        <Col className="content__left xs-12 md-7 lg-6 offset-lg-1">
                          <div>
                            <h2>About</h2>
                            {currentPage.body ? (
                              <div className="markdown-wrapper">
                                <Markdown options={{ forceBlock: true }}>
                                  {currentPage.body}
                                </Markdown>
                              </div>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  )) || (
                    <Container>
                      <Row>
                        <Col className="xs-12 rg-10 offset-rg-1 lg-8 offset-lg-2">
                          <h1 className="content__title">
                            {currentPage.title}
                          </h1>
                          <p>{currentPage.lead}</p>
                          <div>
                            {currentPage.body ? (
                              <div className="markdown-wrapper">
                                <Markdown options={{ forceBlock: true }}>
                                  {currentPage.body}
                                </Markdown>
                              </div>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  )}
                </div>
              </section>
            );
          case "default":
          default:
            return (
              <section
                className={loading ? "content content--loading" : "content"}
              >
                <CustomHead />
                <HeroBG />
                <Hero
                  title={title}
                  subTitle={subTitle}
                  lead={currentPage.lead}
                  ctas={ctas}
                />
                <Container>
                  <Row>
                    <Col className="xs-12">
                      {currentPage.body && (
                        <div className="markdown-wrapper">
                          <Markdown options={{ forceBlock: true }}>
                            {currentPage.body}
                          </Markdown>
                        </div>
                      )}

                      {currentPage.showNews && <NewsSummary />}
                      {(currentPage.showSpeakers || isHome) && (
                        <SpeakersList
                          limit={isHome ? 6 : undefined}
                          withHeading={isHome}
                        />
                      )}
                      {currentPage.showVenue && (
                        <VenueTeaser isVenue={isVenue} />
                      )}
                      {currentPage.showJobs && <Jobs />}
                    </Col>
                  </Row>
                </Container>

                {currentPage.showSponsors && (
                  <div className="dark-background">
                    <Container>
                      <Row>
                        <Col className="xs-12">
                          <Sponsors />
                        </Col>
                      </Row>
                    </Container>
                  </div>
                )}
              </section>
            );
        }
      }}
    </Query>
  );
});
