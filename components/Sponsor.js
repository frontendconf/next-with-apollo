import Markdown from "markdown-to-jsx";
import { Row, Col } from "./shared/Grid";
import Socials from "./Socials";

export default function Sponsor({ details = false, item = {} }) {
  const links = [];

  if (item.twitter) {
    links.push({
      url: `https://twitter.com/${item.twitter}`,
      icon: "twitter",
      a11y: item.title + " Twitter profile"
    });
  }

  if (item.linkedin) {
    links.push({
      url: `https://linkedin.com/${item.linkedin}`,
      icon: "linkedin",
      a11y: item.title + " Linkedin profile"
    });
  }

  if (item.link) {
    links.push({
      url: item.link,
      icon: "website",
      a11y: item.title + " Website"
    });
  }

  const Links = () => <Socials items={links} />;

  return details ? (
    <Row className="sponsor">
      <Col className="xs-12 rg-6 lg-4">
        <a
          className="sponsor__logo"
          href={item.link}
          title={item.title}
          target="_blank"
        >
          {item.logoSvg ? (
            <span
              className="sponsor__svg"
              dangerouslySetInnerHTML={{
                __html: item.logoSvg
              }}
            />
          ) : item.logo ? (
            <img
              className="sponsor__img"
              src={`${item.logo.url}?w=${details ? 333 : 80}`}
              alt={item.title}
            />
          ) : (
            item.title
          )}
        </a>
      </Col>
      <Col className="xs-12 rg-6 lg-8">
        <h4 className="sponsor__title">{item.title}</h4>
        <Markdown className="sponsor__desc">{item.body}</Markdown>
        <div className="sponsor__links">
          <Links />
        </div>
      </Col>
    </Row>
  ) : (
    <a
      className="sponsor sponsor--logo"
      href={item.link}
      title={item.title}
      target="_blank"
    >
      {item.logoSvg ? (
        <span
          className="sponsor__svg"
          dangerouslySetInnerHTML={{
            __html: item.logoSvg
          }}
          style={item.category.color ? { fill: item.category.color } : {}}
        />
      ) : item.logo ? (
        <img className="sponsor__img" src={item.logo.url} alt={item.title} />
      ) : (
        item.title
      )}
    </a>
  );
}
