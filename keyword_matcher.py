import difflib
from typing import List, Dict, Tuple

domain_keywords: Dict[str, List[str]] = {}

def add_domain_keywords(domain_name: str, keywords: List[str]):
    domain_keywords[domain_name] = keywords

def suggest_match_threshold(input_keywords: List[str], domain_keywords: List[str]) -> float:
    input_length = sum(len(k) for k in input_keywords) / len(input_keywords)
    domain_length = sum(len(k) for k in domain_keywords) / len(domain_keywords)
    breadth_score = (input_length + domain_length) / 2

    if breadth_score < 5:
        return 0.8
    elif breadth_score < 10:
        return 0.6
    else:
        return 0.4

def find_matching_domains(input_keywords: List[str]) -> List[str]:
    matching_domains = []
    for domain, keywords in domain_keywords.items():
        threshold = suggest_match_threshold(input_keywords, keywords)
        for input_keyword in input_keywords:
            for keyword in keywords:
                similarity = difflib.SequenceMatcher(None, input_keyword.lower(), keyword.lower()).ratio()
                if similarity >= threshold:
                    matching_domains.append(domain)
                    break
            else:
                continue
            break
    return matching_domains

if __name__ == "__main__":
    # Add domain-specific keyword arrays
    add_domain_keywords("Dr. Emily Carter", ["medicine", "biology", "neurology", "oncology"])
    add_domain_keywords("Michael Reynolds", ["finance", "accounting", "investment", "business management"])
    add_domain_keywords("Sarah Patel", ["computer science", "software", "AI", "data science", "engineering"])
    add_domain_keywords("Dr. Aisha Hassan", ["medicine", "cardiology", "pathology", "radiology"])
    add_domain_keywords("Jason Kim", ["software", "UI/UX", "web development", "engineering"])
    add_domain_keywords("Olivia Grant", ["economics", "finance", "insurance", "business strategy"])
    add_domain_keywords("Arjun Mehta", ["civil", "mechanical", "construction", "architecture"])
    add_domain_keywords("Isabella Nguyen", ["biology", "neuroscience", "pharmacology", "oncology"])
    add_domain_keywords("Daniel O’Connor", ["electrical", "electronics", "robotics", "AI"])
    add_domain_keywords("Nina Das", ["finance", "investment", "statistics", "data analytics"])
    add_domain_keywords("Dr. Thomas Blake", ["psychiatry", "neurology", "psychology", "medicine", "radiology"])
    add_domain_keywords("Ravi Shah", ["software", "engineering", "cloud computing", "cybersecurity"])
    add_domain_keywords("Laura Benson", ["cardiology", "medicine", "public health"])
    add_domain_keywords("Marcus Li", ["accounting", "tax law", "business finance"])
    add_domain_keywords("Priya Ramesh", ["AI", "machine learning", "data science", "software"])
    add_domain_keywords("James Whitman", ["electrical", "mechanical", "aerospace", "engineering"])
    add_domain_keywords("Mei Ling Zhao", ["pharmacology", "pathology", "oncology", "medicine"])
    add_domain_keywords("Ethan Walker", ["robotics", "electronics", "automation", "AI", "software"])
    add_domain_keywords("Anika Joshi", ["UI/UX", "product design", "frontend development", "software"])
    add_domain_keywords("Dr. Leo Martin", ["neurology", "neuroscience", "radiology", "medicine"])

    

    # Example input
    input_keywords = ["cancer", "neural network"]

    matched_domains = find_matching_domains(input_keywords)

    print("Matched Domains:")
    for domain in matched_domains:
        print(domain)
