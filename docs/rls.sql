-- Row Level Security Policies
ALTER TABLE settlethis.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlethis.arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlethis.two_party_arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlethis.single_proposal_arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlethis.votes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can register themselves"
    ON settlethis.users FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());
	
CREATE POLICY "Users can view their own record"
    ON settlethis.users FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update their own record"
    ON settlethis.users FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- Arguments policies
CREATE POLICY "Anyone can view published arguments"
    ON settlethis.arguments FOR SELECT
    TO authenticated
    USING (status = 'published');

CREATE POLICY "Users can view their own arguments"
    ON settlethis.arguments FOR SELECT
    TO authenticated
    USING (created_by_id = auth.uid());

CREATE POLICY "Users can create arguments"
    ON settlethis.arguments FOR INSERT
    TO authenticated
    WITH CHECK (created_by_id = auth.uid());

CREATE POLICY "Users can update their own arguments"
    ON settlethis.arguments FOR UPDATE
    TO authenticated
    USING (created_by_id = auth.uid());

CREATE POLICY "Users can delete their own draft or awaitingSecondParty arguments"
    ON settlethis.arguments FOR DELETE
    TO authenticated
    USING (
        created_by_id = auth.uid() AND (status = 'draft' OR status = 'awaitingSecondParty')
    );

-- Similar policies for two_party_arguments and single_proposal_arguments
-- (They inherit from the arguments table policies through the foreign key)
CREATE POLICY "Second party can update their position"
    ON settlethis.two_party_arguments FOR UPDATE
    TO authenticated
    USING (second_party_id = auth.uid());

-- Votes policies
CREATE POLICY "Anyone can view votes"
    ON settlethis.votes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create their own votes"
    ON settlethis.votes FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users cannot update votes"
    ON settlethis.votes FOR UPDATE
    TO authenticated
    USING (false);

CREATE POLICY "Users cannot delete votes"
    ON settlethis.votes FOR DELETE
    TO authenticated
    USING (false);
